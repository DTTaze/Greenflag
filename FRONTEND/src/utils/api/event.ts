import axiosClient from "../../services";

const getEventPrefix = () => {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/admin");
  return isAdmin ? "/admin/events" : "/partner/events";
};

export const getAllEvents = (showDeleted?: boolean) => {
  return axiosClient.get("/events/informations", { params: { showDeleted } });
};

export const getOwnerEvents = () => {
  // Partner dashboard displays events created by the current user
  return axiosClient.get("/partner/events");
};

export const getEventUsersByEventId = (eventId: string | number) => {
  return axiosClient.get(`/events/user/${eventId}`);
};

export const acceptEvent = (eventId: string | number) => {
  return axiosClient.post(`/events/accept/${eventId}`);
};

export const getEventSignedByUserId = (userId: string | number) => {
  return axiosClient.get(`/events/signed/${userId}`);
};

export const deleteEventUserById = (eventUserId: string | number) => {
  return axiosClient.delete(`${getEventPrefix()}/participants/${eventUserId}`);
};

export const checkInUser = (
  userId: string | number,
  eventId: string | number,
) => {
  return axiosClient.put(`${getEventPrefix()}/${eventId}/check-in`, {
    user_id: userId,
  });
};

export const checkOutUser = (
  userId: string | number,
  eventId: string | number,
) => {
  return axiosClient.put(`${getEventPrefix()}/${eventId}/check-out`, {
    user_id: userId,
  });
};

export const createEvent = (
  eventFormData: Record<string, any>,
  images?: File[],
) => {
  const formData = new FormData();

  Object.keys(eventFormData).forEach((key) => {
    formData.append(key, eventFormData[key]);
  });

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return axiosClient.post(getEventPrefix(), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateEvent = (
  eventId: string | number,
  eventFormData: Record<string, any>,
  images?: File[],
) => {
  const formData = new FormData();

  Object.keys(eventFormData).forEach((key) => {
    formData.append(key, eventFormData[key]);
  });

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return axiosClient.put(`${getEventPrefix()}/${eventId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEvent = (eventId: string | number) => {
  return axiosClient.delete(`${getEventPrefix()}/${eventId}`);
};
