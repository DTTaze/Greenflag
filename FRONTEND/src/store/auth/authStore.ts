import { create } from "zustand";

export interface User {
  id: string | number;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role_id: number;
  roles?: {
    id: number;
    name: string;
  };
  role?: string;
  avatarUrl?: string;
  fullName?: string;
  coins?: {
    amount: number;
  };
  phone_number?: string;
  last_logined?: string;
  birthDate?: string;
  gender?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

interface AuthStore extends AuthState {
  dispatch: (action: AuthAction) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  dispatch: (action) => set((state) => authReducer(state, action)),
  setUser: (user) => set((state) => ({ ...state, user })),
}));
