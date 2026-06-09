import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SocketStubService {
  private readonly logger = new Logger(SocketStubService.name);

  emitStockUpdate(itemId: string, stock: number, details: any): void {
    this.logger.log(
      `[Socket Stub] Stock updated for item ${itemId}: ${stock} items remaining. Details: ${JSON.stringify(details)}`,
    );
  }
}
