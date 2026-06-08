import axios from "../axios.customize";

export const getAllEvents = () => {
  return axios.get("api/events/informations");
};

export const getOwnerEvents = () => {
  return axios.get("api/events/creator");
};

export const getEventUsersByEventId = (eventId: string | number) => {
  return axios.get(`api/events/user/${eventId}`);
};

export const acceptEvent = (eventId: string | number) => {
  return axios.post(`api/events/accept/${eventId}`);
};

export const getEventSignedByUserId = (userId: string | number) => {
  return axios.get(`api/events/signed/${userId}`);
};

export const deleteEventUserById = (eventUserId: string | number) => {
  return axios.delete(`api/events/user/delete/${eventUserId}`);
};

export const checkInUser = (
  userId: string | number,
  eventId: string | number,
) => {
  return axios.put("api/events/check_in", {
    event_id: eventId,
    user_id: userId,
  });
};

export const checkOutUser = (
  userId: string | number,
  eventId: string | number,
) => {
  return axios.put("api/events/check_out", {
    event_id: eventId,
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

  return axios.post("api/events/create", formData, {
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

  return axios.put(`api/events/update/${eventId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEvent = (eventId: string | number) => {
  return axios.delete(`api/events/delete/${eventId}`);
};
