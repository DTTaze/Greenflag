export enum EVENT_STATUS {
  UPCOMING = "upcoming",
  ONGOING = "ongoing",
  FINISHED = "finished",
}

export interface EventType {
  id: string;
  publicId: string;
  creatorId: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  coins: number;
  endSign: string;
  startTime: string;
  endTime: string;
  status: EVENT_STATUS;
  images?: string[];
  creator?: any;
  eventUsers?: EventUserType[];
  createdAt: string;
  updatedAt: string;
}

export interface EventUserType {
  id: string;
  userId: string;
  eventId: string;
  joinedAt?: string;
  completedAt?: string;
  user?: any;
  event?: EventType;
  createdAt: string;
  updatedAt: string;
}
