import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import LoginPage from "./page";
import { proxy } from "@/proxy";

const pushMock = vi.fn();
const setSessionMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/features/auth/session", () => ({
  setSession: (...args: unknown[]) => setSessionMock(...args),
}));

describe("login-role-route smoke", () => {
  it("login page routes selected role to role-home", () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "BusinessAdmin" } });
    fireEvent.click(screen.getByRole("button", { name: /continue as businessadmin/i }));

    expect(setSessionMock).toHaveBeenCalledWith("mock-token", "BusinessAdmin");
    expect(pushMock).toHaveBeenCalledWith("/manager/branches");
  });

  it("proxy redirects unauthenticated users to /login", () => {
    const request = new NextRequest("http://localhost:3000/manager/menu");
    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("proxy redirects role mismatch to /unauthorized", () => {
    const request = new NextRequest("http://localhost:3000/staff/scan", {
      headers: {
        cookie: "auth_token=mock; auth_role=Customer",
      },
    });

    const response = proxy(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/unauthorized");
  });
});
