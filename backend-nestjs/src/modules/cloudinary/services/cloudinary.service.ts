import { v2 as cloudinary } from 'cloudinary';
import { OperationResult } from 'mvc-common-toolkit';

import { Inject, Injectable } from '@nestjs/common';

import { CACHE_TTL, INJECTION_TOKEN } from '@shared/constants';
import { generateSuccessResult } from '@shared/helpers/operation-result.helper';

import { GetSignatureDto } from '../cloudinary.dto';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(INJECTION_TOKEN.CLOUDINARY_SERVICE)
    private readonly cloudinaryService: typeof cloudinary,
  ) {}

  async uploadImage(file: Express.Multer.File, folder: string): Promise<any> {
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryService.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, res) => {
          if (error) return reject(error);
          resolve(res);
        },
      );
      uploadStream.end(file.buffer);
    });

    return result;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'raw' | 'auto' | 'image' | 'video' = 'raw',
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // SỬ DỤNG upload_chunked_stream thay vì upload_stream
      const uploadStream =
        this.cloudinaryService.uploader.upload_chunked_stream(
          {
            folder,
            resource_type: resourceType,
            chunk_size: 6000000, // CẮT NHỎ: 6MB mỗi chunk để đảm bảo luôn dưới mức giới hạn 10MB
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
      uploadStream.end(file.buffer);
    });
  }

  async uploadBase64Image(base64Data: string, folder: string): Promise<any> {
    const dataUri = `data:image/png;base64,${base64Data}`;
    const result = await this.cloudinaryService.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
    });

    return result;
  }

  getUploadSignature(dto: GetSignatureDto): OperationResult {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const apiSecret = this.cloudinaryService.config().api_secret;

    const paramsToSign = {
      timestamp,
      folder: dto.folder,
      expire_at: timestamp + CACHE_TTL.FIVE_MINUTES,
    };

    const signature = this.cloudinaryService.utils.api_sign_request(
      paramsToSign,
      apiSecret,
    );

    return generateSuccessResult({
      folder: dto.folder,
      signature,
      timestamp,
      cloudName: this.cloudinaryService.config().cloud_name,
      apiKey: this.cloudinaryService.config().api_key,
      expireAt: timestamp + CACHE_TTL.FIVE_MINUTES,
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cloudinaryService.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  extractPublicId(url: string): string | null {
    if (!url) return null;
    if (url.includes('default-avatar.png')) return null;
    if (!url.includes('cloudinary.com')) return null;

    const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
    return match ? match[1] : null;
  }
}
