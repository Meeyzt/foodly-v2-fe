import { httpClient } from "@/shared/api/http-client";
import type { AuthResponse, LoginPayload } from "@/features/auth/model/auth.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },
};
