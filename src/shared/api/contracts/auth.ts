import { httpClient } from "@/shared/api/http-client";
import type { ApiResponse } from "@/shared/types/api";

export type LoginRequest = { email: string; password: string };
export type AuthUser = { id: string; email: string; name: string };
export type AuthPayload = { user: AuthUser; accessToken: string };

export async function login(request: LoginRequest) {
  const { data } = await httpClient.post<ApiResponse<AuthPayload>>("/auth/login", request);
  return data;
}

export async function me() {
  const { data } = await httpClient.get<ApiResponse<AuthUser>>("/auth/me");
  return data;
}
