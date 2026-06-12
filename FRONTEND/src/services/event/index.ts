import axiosClient from "@/src/services";
import {
  CreateEventPayload,
  UpdateEventPayload,
} from "@/src/types/event/event.payload";

const buildEventFormData = (payload: any, images?: File[]): FormData => {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined && payload[key] !== null) {
      if (key === "images" && Array.isArray(payload[key])) {
        payload[key].forEach((imgUrl: string) => {
          formData.append("images", imgUrl);
        });
      } else {
        formData.append(key, String(payload[key]));
      }
    }
  });
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }
  return formData;
};

export const eventServices = {
  // --- Public / General User ---
  getAllEvents: (showDeleted?: boolean): Promise<any> =>
    axiosClient.get("/events/informations", { params: { showDeleted } }),

  getEventById: (eventId: string): Promise<any> =>
    axiosClient.get(`/events/information/${eventId}`),

  getEventsSignedSelf: (): Promise<any> => axiosClient.get("/events/signed"),

  getEventsSignedByUserId: (userId: string): Promise<any> =>
    axiosClient.get(`/events/signed/${userId}`),

  getEventUsersByEventId: (eventId: string): Promise<any> =>
    axiosClient.get(`/events/user/${eventId}`),

  acceptEvent: (eventId: string): Promise<any> =>
    axiosClient.post(`/events/accept/${eventId}`),

  generateEventQr: (eventId: string): Promise<any> =>
    axiosClient.get(`/events/qr/${eventId}`),

  // --- Partner ---
  partnerGetMyEvents: (): Promise<any> => axiosClient.get("/partner/events"),

  partnerCreateEvent: (
    payload: CreateEventPayload,
    images?: File[],
  ): Promise<any> => {
    const formData = buildEventFormData(payload, images);
    return axiosClient.post("/partner/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  partnerUpdateEvent: (
    eventId: string,
    payload: UpdateEventPayload,
    images?: File[],
  ): Promise<any> => {
    const formData = buildEventFormData(payload, images);
    return axiosClient.put(`/partner/events/${eventId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  partnerCheckIn: (eventId: string, userId: string): Promise<any> =>
    axiosClient.put(`/partner/events/${eventId}/check-in`, { user_id: userId }),

  partnerCheckOut: (eventId: string, userId: string): Promise<any> =>
    axiosClient.put(`/partner/events/${eventId}/check-out`, {
      user_id: userId,
    }),

  partnerDeleteParticipant: (eventUserId: string): Promise<any> =>
    axiosClient.delete(`/partner/events/participants/${eventUserId}`),

  partnerDeleteEvent: (eventId: string): Promise<any> =>
    axiosClient.delete(`/partner/events/${eventId}`),

  // --- Admin ---
  adminCreateEvent: (
    payload: CreateEventPayload,
    images?: File[],
  ): Promise<any> => {
    const formData = buildEventFormData(payload, images);
    return axiosClient.post("/admin/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  adminUpdateEvent: (
    eventId: string,
    payload: UpdateEventPayload,
    images?: File[],
  ): Promise<any> => {
    const formData = buildEventFormData(payload, images);
    return axiosClient.put(`/admin/events/${eventId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  adminCheckIn: (eventId: string, userId: string): Promise<any> =>
    axiosClient.put(`/admin/events/${eventId}/check-in`, { user_id: userId }),

  adminCheckOut: (eventId: string, userId: string): Promise<any> =>
    axiosClient.put(`/admin/events/${eventId}/check-out`, { user_id: userId }),

  adminDeleteEvent: (eventId: string): Promise<any> =>
    axiosClient.delete(`/admin/events/${eventId}`),

  adminDeleteParticipant: (eventUserId: string): Promise<any> =>
    axiosClient.delete(`/admin/events/participants/${eventUserId}`),
};
