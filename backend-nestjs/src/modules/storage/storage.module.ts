import { Global, Module } from '@nestjs/common';

import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';

import { CloudinaryStorageProvider } from './providers/cloudinary.provider';
import { R2StorageProvider } from './providers/r2.provider';
import { StorageService } from './storage.service';

@Global()
@Module({
  imports: [CloudinaryModule],
  providers: [StorageService, R2StorageProvider, CloudinaryStorageProvider],
  exports: [StorageService],
})
export class StorageModule {}
