import { EVENT_STATUS } from "./event.type";

export interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  capacity: number;
  coins: number;
  end_sign: string;
  start_time: string;
  end_time: string;
  images?: string[];
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;
  capacity?: number;
  coins?: number;
  start_time?: string;
  end_time?: string;
  status?: EVENT_STATUS;
  images?: string[];
}

export interface CheckInOutPayload {
  event_id: string;
  user_id: string;
}
