import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { extname } from 'path';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import r2Config from '@configs/r2.config';

import { IStorageProvider } from '../interfaces/storage-provider.interface';

@Injectable()
export class R2StorageProvider implements IStorageProvider {
  private readonly logger = new Logger(R2StorageProvider.name);
  private readonly s3Client: S3Client;

  constructor(
    @Inject(r2Config.KEY)
    private readonly config: ConfigType<typeof r2Config>,
  ) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'raw' | 'auto' | 'image' | 'video' = 'auto',
  ): Promise<string> {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = `${folder}/${uniqueSuffix}${extname(file.originalname)}`;

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      this.logger.log(
        `Successfully uploaded file ${fileName} to Cloudflare R2`,
      );

      return `${this.config.publicDomain}/${fileName}`;
    } catch (error) {
      this.logger.error(
        `Failed to upload file to Cloudflare R2: ${error.message}`,
      );
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = fileUrl.replace(`${this.config.publicDomain}/`, '');
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Successfully deleted file ${key} from Cloudflare R2`);
    } catch (error) {
      this.logger.error(
        `Failed to delete file from Cloudflare R2: ${error.message}`,
      );
      throw error;
    }
  }

  async uploadBase64Image(
    base64Data: string,
    folder: string = 'images/upload/diagnoses-results',
  ): Promise<string> {
    try {
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = `${folder}/${uniqueSuffix}.png`;

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/png',
      });

      await this.s3Client.send(command);
      this.logger.log(
        `Successfully uploaded base64 image ${fileName} to Cloudflare R2`,
      );

      return `${this.config.publicDomain}/${fileName}`;
    } catch (error) {
      this.logger.error(
        `Failed to upload base64 image to Cloudflare R2: ${error.message}`,
      );
      throw error;
    }
  }
}
