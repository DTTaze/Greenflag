import {
  acceptEventHandler,
  generateEventQrHandler,
  getAllEventsHandler,
  getEventByIdHandler,
  getEventsSignedByUserIdHandler,
  getEventsSignedSelfHandler,
  getEventUsersByEventIdHandler,
  partnerGetMyEventsHandler,
} from "@/src/services/event/eventHandlers";
import {
  EventQrResponse,
  EventResponse,
  EventUserResponse,
} from "@/src/types/event/event.response";

export const getAllEventsQueryFn = async (): Promise<EventResponse[]> => {
  const response = await getAllEventsHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch events");
  }
  return response.data;
};

export const getEventByIdQueryFn = async (
  eventId: string,
): Promise<EventResponse> => {
  const response = await getEventByIdHandler(eventId);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch event detail");
  }
  return response.data;
};

export const getEventsSignedSelfQueryFn = async (): Promise<
  EventUserResponse[]
> => {
  const response = await getEventsSignedSelfHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch signed events");
  }
  return response.data;
};

export const getEventsSignedByUserIdQueryFn = async (
  userId: string,
): Promise<EventUserResponse[]> => {
  const response = await getEventsSignedByUserIdHandler(userId);
  if (!response.success) {
    throw new Error(
      response.message || "Failed to fetch signed events for user",
    );
  }
  return response.data;
};

export const getEventUsersByEventIdQueryFn = async (
  eventId: string,
): Promise<EventUserResponse[]> => {
  const response = await getEventUsersByEventIdHandler(eventId);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch event participants");
  }
  return response.data;
};

export const generateEventQrQueryFn = async (
  eventId: string,
): Promise<EventQrResponse> => {
  const response = await generateEventQrHandler(eventId);
  if (!response.success) {
    throw new Error(response.message || "Failed to generate QR code for event");
  }
  return response.data;
};

export const partnerGetMyEventsQueryFn = async (): Promise<EventResponse[]> => {
  const response = await partnerGetMyEventsHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch partner events");
  }
  return response.data;
};
