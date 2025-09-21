import { Inject, Injectable } from '@nestjs/common';
import {
  v2 as Cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) {}

  async uploadImage(
    file: Express.Multer.File,
    folder = 'profile_pictures',
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const options: UploadApiOptions = { folder };
      const upload = this.cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );
      upload.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return this.cloudinary.uploader.destroy(publicId);
  }
}
