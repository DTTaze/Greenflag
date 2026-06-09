import { ApiResponse } from "@/src/types/api";
import {
  CreateEventPayload,
  UpdateEventPayload,
} from "@/src/types/event/event.payload";
import {
  EventQrResponse,
  EventResponse,
  EventUserResponse,
} from "@/src/types/event/event.response";

import { eventServices } from ".";

// --- Public Handlers ---

export const getAllEventsHandler = async (): Promise<ApiResponse<EventResponse[]>> => {
  return eventServices.getAllEvents();
};

export const getEventByIdHandler = async (
  eventId: string,
): Promise<ApiResponse<EventResponse>> => {
  return eventServices.getEventById(eventId);
};

export const getEventsSignedSelfHandler = async (): Promise<
  ApiResponse<EventUserResponse[]>
> => {
  return eventServices.getEventsSignedSelf();
};

export const getEventsSignedByUserIdHandler = async (
  userId: string,
): Promise<ApiResponse<EventUserResponse[]>> => {
  return eventServices.getEventsSignedByUserId(userId);
};

export const getEventUsersByEventIdHandler = async (
  eventId: string,
): Promise<ApiResponse<EventUserResponse[]>> => {
  return eventServices.getEventUsersByEventId(eventId);
};

export const acceptEventHandler = async (
  eventId: string,
): Promise<ApiResponse<EventUserResponse>> => {
  return eventServices.acceptEvent(eventId);
};

export const generateEventQrHandler = async (
  eventId: string,
): Promise<ApiResponse<EventQrResponse>> => {
  return eventServices.generateEventQr(eventId);
};

// --- Partner Handlers ---

export const partnerGetMyEventsHandler = async (): Promise<
  ApiResponse<EventResponse[]>
> => {
  return eventServices.partnerGetMyEvents();
};

export const partnerCreateEventHandler = async (
  payload: CreateEventPayload,
  images?: File[],
): Promise<ApiResponse<EventResponse>> => {
  return eventServices.partnerCreateEvent(payload, images);
};

export const partnerUpdateEventHandler = async (
  eventId: string,
  payload: UpdateEventPayload,
  images?: File[],
): Promise<ApiResponse<EventResponse>> => {
  return eventServices.partnerUpdateEvent(eventId, payload, images);
};

export const partnerCheckInHandler = async (
  eventId: string,
  userId: string,
): Promise<ApiResponse<EventUserResponse>> => {
  return eventServices.partnerCheckIn(eventId, userId);
};

export const partnerCheckOutHandler = async (
  eventId: string,
  userId: string,
): Promise<ApiResponse<EventUserResponse>> => {
  return eventServices.partnerCheckOut(eventId, userId);
};

export const partnerDeleteParticipantHandler = async (
  eventUserId: string,
): Promise<ApiResponse<void>> => {
  return eventServices.partnerDeleteParticipant(eventUserId);
};

// --- Admin Handlers ---

export const adminCreateEventHandler = async (
  payload: CreateEventPayload,
  images?: File[],
): Promise<ApiResponse<EventResponse>> => {
  return eventServices.adminCreateEvent(payload, images);
};

export const adminUpdateEventHandler = async (
  eventId: string,
  payload: UpdateEventPayload,
  images?: File[],
): Promise<ApiResponse<EventResponse>> => {
  return eventServices.adminUpdateEvent(eventId, payload, images);
};

export const adminCheckInHandler = async (
  eventId: string,
  userId: string,
): Promise<ApiResponse<EventUserResponse>> => {
  return eventServices.adminCheckIn(eventId, userId);
};

export const adminCheckOutHandler = async (
  eventId: string,
  userId: string,
): Promise<ApiResponse<EventUserResponse>> => {
  return eventServices.adminCheckOut(eventId, userId);
};

export const adminDeleteEventHandler = async (
  eventId: string,
): Promise<ApiResponse<void>> => {
  return eventServices.adminDeleteEvent(eventId);
};

export const adminDeleteParticipantHandler = async (
  eventUserId: string,
): Promise<ApiResponse<void>> => {
  return eventServices.adminDeleteParticipant(eventUserId);
};
