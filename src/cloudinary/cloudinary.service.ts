import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadImage(file: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME') || 'dimxduwpw',
      api_key: this.configService.get('CLOUDINARY_API_KEY') || '331352586624732',
      api_secret: this.configService.get('CLOUDINARY_API_SECRET') || 'ntj5_rDuta78UGa21G_Twd90hbs',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'olavarria_conecta',
          format: 'webp',
          transformation: [{ quality: 'auto' }]
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          // Retornamos solo la URL segura para guardarla en MySQL
          resolve(result.secure_url);
        },
      );

      // Usamos el buffer que viene de Multer
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
 async deleteFile(publicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}
}
