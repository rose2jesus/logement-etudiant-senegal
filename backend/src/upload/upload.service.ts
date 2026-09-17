import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  // Compresse/redimensionne automatiquement via les transformations Cloudinary
  // (répond à l'exigence de la section 13 : ne pas ralentir le site avec des photos lourdes)
  uploadImage(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'logement-etudiant-senegal',
          transformation: [{ width: 1200, height: 900, crop: 'limit' }, { quality: 'auto:good' }],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        },
      );
      stream.end(fileBuffer);
    });
  }
}
