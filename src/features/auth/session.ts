"use client";

import Cookies from "js-cookie";
import type { UserRole } from "@/shared/auth/roles";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";

export function setSession(token: string, role: UserRole) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  }
  Cookies.set(TOKEN_KEY, token);
  Cookies.set(ROLE_KEY, role);
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  }
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}

export function getRoleFromSession(): UserRole | null {
  if (typeof window === "undefined") return null;
  const role = localStorage.getItem(ROLE_KEY);
  if (!role) return null;
  return role as UserRole;
}
