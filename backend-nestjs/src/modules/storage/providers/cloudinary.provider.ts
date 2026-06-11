import { Injectable, Logger } from '@nestjs/common';

import { CloudinaryService } from '@modules/cloudinary/services/cloudinary.service';

import { IStorageProvider } from '../interfaces/storage-provider.interface';

@Injectable()
export class CloudinaryStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(CloudinaryStorageProvider.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'raw' | 'auto' | 'image' | 'video' = 'auto',
  ): Promise<string> {
    try {
      if (resourceType === 'raw') {
        const uploadResult = await this.cloudinaryService.uploadFile(
          file,
          folder,
          'raw',
        );
        return uploadResult.secure_url;
      }

      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        folder,
      );
      return uploadResult.secure_url;
    } catch (error) {
      this.logger.error(`Cloudinary upload failed: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const resourceType = this.getResourceTypeFromUrl(fileUrl);
      const publicId = this.extractPublicId(fileUrl);

      if (!publicId) {
        this.logger.warn(
          `Could not extract public ID from Cloudinary URL: ${fileUrl}`,
        );
        return;
      }

      // Delegate destruction to the raw Cloudinary client inside CloudinaryService
      const rawCloudinary = (this.cloudinaryService as any).cloudinaryService;
      if (!rawCloudinary) {
        throw new Error(
          'Raw Cloudinary SDK instance not found on CloudinaryService',
        );
      }

      await rawCloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      this.logger.log(
        `Successfully deleted ${resourceType} file with public ID ${publicId} from Cloudinary`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete file from Cloudinary: ${error.message}`,
      );
      throw error;
    }
  }

  async uploadBase64Image(
    base64Data: string,
    folder?: string,
  ): Promise<string> {
    try {
      const uploadResult = await this.cloudinaryService.uploadBase64Image(
        base64Data,
        folder,
      );
      return uploadResult.secure_url;
    } catch (error) {
      this.logger.error(`Cloudinary base64 upload failed: ${error.message}`);
      throw error;
    }
  }

  private getResourceTypeFromUrl(fileUrl: string): 'image' | 'raw' | 'video' {
    if (fileUrl.includes('/raw/upload/')) return 'raw';
    if (fileUrl.includes('/video/upload/')) return 'video';
    return 'image';
  }

  private extractPublicId(fileUrl: string): string {
    const parts = fileUrl.split('/upload/');
    if (parts.length < 2) return '';

    const pathAfterUpload = parts[1].replace(/^v\d+\//, '');
    const resourceType = this.getResourceTypeFromUrl(fileUrl);

    if (resourceType === 'raw') {
      // Cloudinary raw resources preserve extensions in their public ID
      return pathAfterUpload;
    }

    const dotIndex = pathAfterUpload.lastIndexOf('.');
    if (dotIndex === -1) return pathAfterUpload;
    return pathAfterUpload.substring(0, dotIndex);
  }
}
