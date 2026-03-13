import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Configura tus credenciales (Usá @nestjs/config si lo tenés instalado)
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARU_CLOUD_NAME') || 'dimxduwpw',
      api_key: this.configService.get('CLOUDINARU_API_KEY') || '331352586624732',
      api_secret: this.configService.get('CLOUDINARU_API_SECRET') || 'ntj5_rDuta78UGa21G_Twd90hbs',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'olavarria_conecta', // Tu carpeta en la nube
          format: 'webp',              // Magia: conversión automática
          transformation: [{ quality: 'auto' }]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Esto convierte el buffer de Multer en un stream para Cloudinary
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}
