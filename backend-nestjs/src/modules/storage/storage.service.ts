import { BadRequestException, Injectable } from '@nestjs/common';

import { CloudinaryStorageProvider } from './providers/cloudinary.provider';
import { R2StorageProvider } from './providers/r2.provider';

export enum StorageType {
  R2 = 'R2',
  CLOUDINARY = 'CLOUDINARY',
}

@Injectable()
export class StorageService {
  constructor(
    private readonly r2Provider: R2StorageProvider,
    private readonly cloudinaryProvider: CloudinaryStorageProvider,
  ) {}

  private getProvider(type: StorageType) {
    switch (type) {
      case StorageType.R2:
        return this.r2Provider;
      case StorageType.CLOUDINARY:
        return this.cloudinaryProvider;
      default:
        throw new BadRequestException(
          `Định dạng lưu trữ "${type}" không khả dụng.`,
        );
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    type: StorageType = StorageType.CLOUDINARY,
    resourceType: 'raw' | 'auto' | 'image' | 'video' = 'auto',
  ): Promise<string> {
    const provider = this.getProvider(type);
    return provider.uploadFile(file, folder, resourceType);
  }

  async deleteFile(
    fileUrl: string,
    type: StorageType = StorageType.CLOUDINARY,
  ): Promise<void> {
    const provider = this.getProvider(type);
    return provider.deleteFile(fileUrl);
  }

  async uploadBase64Image(
    base64Data: string,
    folder?: string,
    type: StorageType = StorageType.CLOUDINARY,
  ): Promise<string> {
    const provider = this.getProvider(type);
    if (!provider.uploadBase64Image) {
      throw new BadRequestException(
        `Trình lưu trữ "${type}" không hỗ trợ tải ảnh base64.`,
      );
    }
    return provider.uploadBase64Image(base64Data, folder);
  }
}
