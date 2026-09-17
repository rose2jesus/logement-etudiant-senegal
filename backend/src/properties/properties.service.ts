import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
import { ModeratePropertyDto } from './dto/moderate-property.dto';

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 7)
  );
}

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreatePropertyDto) {
    const { images, features, availableFrom, ...rest } = dto;

    return this.prisma.property.create({
      data: {
        ...rest,
        ownerId,
        slug: slugify(dto.title),
        status: PropertyStatus.pending, // jamais publié directement (section 14)
        availableFrom: availableFrom ? new Date(availableFrom) : undefined,
        images: { create: images.map((url, i) => ({ url, position: i })) },
        features: {
          create: (features ?? []).map((key) => ({ featureKey: key, featureValue: true })),
        },
      },
      include: { images: true, features: true },
    });
  }

  // Recherche publique : uniquement les annonces approuvées
  async search(query: SearchPropertyDto) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 12, 50);

    const where: Prisma.PropertyWhereInput = {
      status: PropertyStatus.approved,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      cityId: query.cityId,
      neighborhoodId: query.neighborhoodId,
      institutionId: query.institutionId,
      type: query.type,
      furnished: query.furnished,
      price: {
        gte: query.minPrice,
        lte: query.maxPrice,
      },
    };

    const now = new Date();
    // Les annonces sponsorisées (promotedUntil dans le futur) remontent toujours en premier,
    // le tri demandé par l'utilisateur s'applique ensuite au sein de chaque groupe.
    const orderBy: Prisma.PropertyOrderByWithRelationInput[] = [
      { promotedUntil: 'desc' },
      query.sort === 'price_asc'
        ? { price: 'asc' }
        : query.sort === 'price_desc'
          ? { price: 'desc' }
          : { publishedAt: 'desc' },
    ];

    const [items, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          images: { orderBy: { position: 'asc' }, take: 1 },
          city: true,
          neighborhood: true,
          institution: true,
          features: true,
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    const itemsWithPromotion = items.map((item) => ({
      ...item,
      isPromoted: !!(item.promotedUntil && item.promotedUntil > now),
    }));

    return { items: itemsWithPromotion, total, page, pageSize };
  }

  async findBySlug(slug: string, requesterId?: string, requesterRole?: string) {
    const property = await this.prisma.property.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: 'asc' } },
        features: true,
        city: true,
        neighborhood: true,
        institution: true,
        owner: { include: { user: { select: { firstName: true, createdAt: true } } } },
      },
    });
    if (!property) throw new NotFoundException('Annonce introuvable');

    // Une annonce non approuvée n'est visible que par son propriétaire ou un admin
    const isOwner = property.ownerId === requesterId;
    const isAdmin = requesterRole === 'admin';
    const isPubliclyAvailable =
      property.status === PropertyStatus.approved &&
      (property.expiresAt === null || property.expiresAt > new Date());
    if (!isPubliclyAvailable && !isOwner && !isAdmin) {
      throw new NotFoundException('Annonce introuvable');
    }

    // Incrémente le compteur de vues (fire and forget, sans bloquer la réponse)
    this.prisma.property
      .update({ where: { id: property.id }, data: { viewsCount: { increment: 1 } } })
      .catch(() => undefined);

    return {
      ...property,
      isPromoted: !!(property.promotedUntil && property.promotedUntil > new Date()),
    };
  }

  findMine(ownerId: string) {
    return this.prisma.property.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      include: { images: { take: 1 }, city: true, _count: { select: { contactRequests: true } } },
    }).then((properties) =>
      properties.map((p) => ({
        ...p,
        isPromoted: !!(p.promotedUntil && p.promotedUntil > new Date()),
      })),
    );
  }

  findPendingForModeration() {
    return this.prisma.property.findMany({
      where: { status: PropertyStatus.pending },
      orderBy: { createdAt: 'asc' },
      include: { images: true, city: true, owner: { include: { user: true } } },
    });
  }

  async moderate(propertyId: string, adminId: string, dto: ModeratePropertyDto) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Annonce introuvable');

    const updated = await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        status: dto.status,
        rejectionReason: dto.status === PropertyStatus.rejected ? dto.rejectionReason : null,
        publishedAt: dto.status === PropertyStatus.approved ? new Date() : property.publishedAt,
        expiresAt:
          dto.status === PropertyStatus.approved
            ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // expire 90 jours après publication
            : property.expiresAt,
      },
    });

    await this.prisma.adminAction.create({
      data: {
        adminId,
        actionType: `moderate_${dto.status}`,
        targetType: 'property',
        targetId: propertyId,
      },
    });

    return updated;
  }

  async remove(propertyId: string, requesterId: string, requesterRole: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Annonce introuvable');
    if (property.ownerId !== requesterId && requesterRole !== 'admin') {
      throw new ForbiddenException("Tu n'es pas autorisé à supprimer cette annonce");
    }
    await this.prisma.property.delete({ where: { id: propertyId } });
    return { deleted: true };
  }
}
