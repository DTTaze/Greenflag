import { EventType, EventUserType } from "./event.type";

export type EventResponse = EventType;
export type EventUserResponse = EventUserType;

export interface EventQrResponse {
  qrCode: string;
}
