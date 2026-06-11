import { Server, Socket } from 'socket.io';

import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('Notification WebSocket Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Extract token from multiple handshake parameters
      let token = client.handshake.auth?.token;

      // Fallback 1: Handshake headers authorization
      if (!token && client.handshake.headers?.authorization) {
        const authHeader = client.handshake.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        } else {
          token = authHeader;
        }
      }

      // Fallback 2: Query parameters
      if (!token && client.handshake.query?.token) {
        token = client.handshake.query.token as string;
      }

      if (!token) {
        this.logger.warn(
          `Connection rejected: missing auth token for client ${client.id}`,
        );
        client.disconnect(true);
        return;
      }

      // Decode and verify jwt token
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload || !payload.id) {
        this.logger.warn(
          `Connection rejected: invalid jwt payload for client ${client.id}`,
        );
        client.disconnect(true);
        return;
      }

      // Cache token payload in socket client
      client.data.user = payload;

      // Join client to user room
      const roomName = payload.id.toString();
      await client.join(roomName);

      this.logger.log(
        `Client ${client.id} authenticated successfully and joined room ${roomName}`,
      );
    } catch (err) {
      this.logger.warn(
        `Connection authentication failed for client ${client.id}: ${err.message}`,
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (user) {
      this.logger.log(`Client ${client.id} disconnected (User: ${user.id})`);
    } else {
      this.logger.log(`Client ${client.id} disconnected (Unauthenticated)`);
    }
  }

  /**
   * Broadcast message to a specific user room
   */
  sendToUser(recipientId: string, eventName: string, data: any) {
    const roomName = recipientId.toString();
    this.server.to(roomName).emit(eventName, data);
    this.logger.log(
      `Realtime notification emitted to room ${roomName} via event ${eventName}`,
    );
  }
}
