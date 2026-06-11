import { UserType } from "../user/user.type";

export interface AdminEventDTO {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  imageUrls: string[];
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDTO {
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
}

export interface UpdateEventDTO {
  name?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  maxParticipants?: number;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
}

export interface EventParticipantDTO {
  id: string;
  eventId: string;
  userId: string;
  user?: UserType;
  checkInTime?: string;
  checkOutTime?: string;
  status: "REGISTERED" | "CHECKED_IN" | "CHECKED_OUT";
}
