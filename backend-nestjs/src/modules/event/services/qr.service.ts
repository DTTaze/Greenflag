import * as QRCode from 'qrcode';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class QrService {
  async generateDataUrl(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to generate QR code: ${error.message}`,
      );
    }
  }
}
