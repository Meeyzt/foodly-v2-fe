import { rest } from "msw";
import type { ApiResponse } from "@/shared/types/api";
import type { AuthPayload, AuthUser, LoginRequest } from "@/shared/api/contracts/auth";

const usersByRole = {
  customer: { id: "u-customer", email: "customer@foodly.app", name: "Customer Demo" },
  staff: { id: "u-staff", email: "staff@foodly.app", name: "Staff Demo" },
  manager: { id: "u-manager", email: "manager@foodly.app", name: "Manager Demo" },
  admin: { id: "u-admin", email: "admin@foodly.app", name: "Admin Demo" },
} as const;

function resolveUserByEmail(email: string): AuthUser {
  const key = email.split("@")[0]?.toLowerCase() ?? "";
  if (key.includes("staff")) return usersByRole.staff;
  if (key.includes("manager")) return usersByRole.manager;
  if (key.includes("admin")) return usersByRole.admin;
  return usersByRole.customer;
}

export const authHandlers = [
  rest.post("*/auth/login", async (req, res, ctx) => {
    const body = (await req.json()) as LoginRequest;

    if (!body.email || !body.password || body.password.length < 3) {
      return res(ctx.status(400), ctx.json({ success: false, message: "Invalid credentials" }));
    }

    const user = resolveUserByEmail(body.email);
    const response: ApiResponse<AuthPayload> = {
      success: true,
      data: {
        user,
        accessToken: `mock-token-${user.id}`,
      },
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get("*/auth/me", (req, res, ctx) => {
    const token = req.headers.get("authorization");
    if (!token) {
      return res(ctx.status(401), ctx.json({ success: false, message: "Unauthorized" }));
    }

    const user: AuthUser = usersByRole.customer;
    const response: ApiResponse<AuthUser> = { success: true, data: user };
    return res(ctx.status(200), ctx.json(response));
  }),
];
