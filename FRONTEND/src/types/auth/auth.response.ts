import { UserType } from "../user/user.type";

export interface AuthResponse {
  accessToken: string;
  user: UserType;
  requirePasswordSetup?: boolean;
}

