import { Module } from '@nestjs/common';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MediaController } from './media.controller';

@Module({
  imports: [CloudinaryModule],
  controllers: [MediaController],
})
export class MediaModule {}
