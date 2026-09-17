import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_SIZE_BYTES } }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier reçu');
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException('Format non supporté (jpg, png, webp uniquement)');
    }
    const url = await this.uploadService.uploadImage(file.buffer);
    return { url };
  }
}
