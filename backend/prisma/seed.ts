// Script de données de démonstration — ÉTAPE 30 du cahier des charges
// Toutes les annonces créées ici ont isDemo=true pour être clairement identifiables.
import { PrismaClient, PropertyType, PropertyStatus, PricePeriod, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed en cours...');

  // Villes
  const dakar = await prisma.city.upsert({
    where: { slug: 'dakar' }, update: {}, create: { name: 'Dakar', slug: 'dakar' },
  });
  const thies = await prisma.city.upsert({
    where: { slug: 'thies' }, update: {}, create: { name: 'Thiès', slug: 'thies' },
  });
  const kaolack = await prisma.city.upsert({
    where: { slug: 'kaolack' }, update: {}, create: { name: 'Kaolack', slug: 'kaolack' },
  });

  // Quartiers
  const grandDakar = await prisma.neighborhood.upsert({
    where: { cityId_name: { cityId: dakar.id, name: 'Grand Dakar' } },
    update: {}, create: { cityId: dakar.id, name: 'Grand Dakar' },
  });
  const mermoz = await prisma.neighborhood.upsert({
    where: { cityId_name: { cityId: dakar.id, name: 'Mermoz' } },
    update: {}, create: { cityId: dakar.id, name: 'Mermoz' },
  });

  // Établissements
  const ucad = await prisma.institution.upsert({
    where: { id: 'seed-ucad' }, update: { latitude: 14.6928, longitude: -17.4630 },
    create: { id: 'seed-ucad', cityId: dakar.id, name: 'UCAD', type: 'université', latitude: 14.6928, longitude: -17.4630 },
  });
  const esp = await prisma.institution.upsert({
    where: { id: 'seed-esp' }, update: { latitude: 14.6939, longitude: -17.4652 },
    create: { id: 'seed-esp', cityId: dakar.id, name: 'ESP', type: 'école', latitude: 14.6939, longitude: -17.4652 },
  });

  // Compte propriétaire de démonstration
  const demoPassword = await bcrypt.hash('demo12345', 10);
  const ownerUser = await prisma.user.upsert({
    where: { email: 'proprietaire-demo@test.sn' },
    update: {},
    create: {
      role: UserRole.owner,
      firstName: 'Awa',
      lastName: 'Diop',
      email: 'proprietaire-demo@test.sn',
      phone: '770000001',
      passwordHash: demoPassword,
      isVerified: true,
    },
  });
  await prisma.owner.upsert({
    where: { userId: ownerUser.id },
    update: {},
    create: { userId: ownerUser.id, ownerType: 'particulier', phoneVerified: true },
  });

  // Compte étudiant de démonstration
  const studentUser = await prisma.user.upsert({
    where: { email: 'etudiant-demo@test.sn' },
    update: {},
    create: {
      role: UserRole.student,
      firstName: 'Moussa',
      lastName: 'Fall',
      email: 'etudiant-demo@test.sn',
      phone: '770000002',
      passwordHash: demoPassword,
    },
  });
  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: { userId: studentUser.id, institutionId: ucad.id, cityId: dakar.id },
  });

  // Admin de démonstration
  await prisma.user.upsert({
    where: { email: 'admin@test.sn' },
    update: {},
    create: {
      role: UserRole.admin,
      firstName: 'Admin',
      lastName: 'Plateforme',
      email: 'admin@test.sn',
      phone: '770000003',
      passwordHash: demoPassword,
      isVerified: true,
    },
  });

  // Annonces de démonstration (clairement marquées isDemo: true)
  const demoProperties = [
    {
      title: 'Chambre individuelle meublée proche UCAD',
      description:
        "Belle chambre individuelle meublée, calme, idéale pour étudiant sérieux. Cuisine partagée, eau et électricité incluses dans le loyer. Quartier sécurisé, à quelques minutes à pied de l'université.",
      type: PropertyType.chambre_individuelle,
      neighborhoodId: grandDakar.id,
      institutionId: ucad.id,
      distanceKm: 1.2,
      price: 35000,
      furnished: true,
      capacity: 1,
      features: ['wifi', 'eau', 'cuisine'],
    },
    {
      title: 'Studio moderne à Mermoz',
      description:
        "Studio récent avec salle de bain privée, climatisation et connexion Wi-Fi. Immeuble sécurisé avec gardien. Parfait pour un étudiant qui veut son indépendance.",
      type: PropertyType.studio,
      neighborhoodId: mermoz.id,
      institutionId: esp.id,
      distanceKm: 2.5,
      price: 75000,
      furnished: true,
      capacity: 1,
      features: ['wifi', 'eau', 'electricite', 'climatisation', 'securite'],
    },
    {
      title: 'Colocation 3 chambres proche campus',
      description:
        "Grande maison en colocation, 3 chambres disponibles, salon commun, cuisine équipée. Ambiance conviviale entre étudiants. Parking disponible pour les motos.",
      type: PropertyType.colocation,
      neighborhoodId: grandDakar.id,
      institutionId: ucad.id,
      distanceKm: 0.8,
      price: 45000,
      furnished: false,
      capacity: 3,
      features: ['eau', 'electricite', 'parking', 'cuisine'],
    },
  ];

  for (const p of demoProperties) {
    const slug = p.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-') + '-demo';
    await prisma.property.upsert({
      where: { slug },
      update: {},
      create: {
        ...p,
        slug,
        cityId: dakar.id,
        ownerId: ownerUser.id,
        pricePeriod: PricePeriod.mois,
        status: PropertyStatus.approved,
        isDemo: true,
        publishedAt: new Date(),
        deposit: p.price,
        minDurationMonths: 3,
        images: {
          create: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', position: 0 }],
        },
        features: { create: p.features.map((key) => ({ featureKey: key, featureValue: true })) },
      },
    });
  }

  console.log('Seed terminé.');
  console.log('Comptes de test : proprietaire-demo@test.sn / etudiant-demo@test.sn / admin@test.sn — mot de passe: demo12345');

  // Annonce volontairement en attente, pour tester le flux de modération admin dès le premier lancement
  const pendingSlug = 'appartement-kaolack-en-attente-demo';
  await prisma.property.upsert({
    where: { slug: pendingSlug },
    update: {},
    create: {
      title: 'Appartement à Kaolack (en attente de modération)',
      description:
        "Annonce de démonstration volontairement laissée au statut 'pending' pour tester le dashboard admin (approbation/rejet) dès le premier lancement de l'application.",
      type: PropertyType.appartement,
      slug: pendingSlug,
      cityId: kaolack.id,
      ownerId: ownerUser.id,
      price: 50000,
      pricePeriod: PricePeriod.mois,
      furnished: true,
      capacity: 2,
      status: PropertyStatus.pending,
      isDemo: true,
      images: {
        create: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', position: 0 }],
      },
    },
  });
  console.log('Annonce "en attente" créée pour tester la modération admin.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
