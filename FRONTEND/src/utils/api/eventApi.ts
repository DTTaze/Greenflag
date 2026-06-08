import axios from "../axios.customize";

export const getAllEventsApi = () => {
  return axios.get("api/events/informations");
};

export const getOwnerEventApi = () => {
  return axios.get("api/events/creator");
};

export const getEventUserByEventIdApi = (event_id: string | number) => {
  return axios.get(`api/events/user/${event_id}`);
};

export const acceptEventApi = (event_id: string | number) => {
  return axios.post(`api/events/accept/${event_id}`);
};

export const getEventSignedByUserIdApi = (user_id: string | number) => {
  return axios.get(`api/events/signed/${user_id}`);
};

export const deleteEventUserByIdApi = (eventUser_id: string | number) => {
  return axios.delete(`api/events/user/delete/${eventUser_id}`);
};

export const CheckInUserByUserIdApi = (
  user_id: string | number,
  event_id: string | number,
) => {
  return axios.put("api/events/check_in", {
    event_id: event_id,
    user_id: user_id,
  });
};

export const CheckOutUserByUserIdApi = (
  user_id: string | number,
  event_id: string | number,
) => {
  return axios.put("api/events/check_out", {
    event_id: event_id,
    user_id: user_id,
  });
};

export const createEventApi = (
  formEventData: Record<string, any>,
  images?: File[],
) => {
  const formData = new FormData();

  Object.keys(formEventData).forEach((key) => {
    formData.append(key, formEventData[key]);
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

export const updateEventApi = (
  event_id: string | number,
  formEventData: Record<string, any>,
  images?: File[],
) => {
  const formData = new FormData();

  Object.keys(formEventData).forEach((key) => {
    formData.append(key, formEventData[key]);
  });

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return axios.put(`api/events/update/${event_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEventApi = (event_id: string | number) => {
  return axios.delete(`api/events/delete/${event_id}`);
};
