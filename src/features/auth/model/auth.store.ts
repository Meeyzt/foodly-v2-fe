import Cookies from "js-cookie";
import { create } from "zustand";
import type { User } from "./auth.types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (params: { user: User; accessToken: string }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setSession: ({ user, accessToken }) => {
    localStorage.setItem("auth_token", accessToken);
    Cookies.set("auth_token", accessToken);
    set({ user, accessToken, isAuthenticated: true });
  },
  clearSession: () => {
    localStorage.removeItem("auth_token");
    Cookies.remove("auth_token");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
