import { describe, expect, it } from "vitest";
import { allRoles, canAccessPath } from "./roles";

const protectedPaths = ["/customer/explore", "/staff/scan", "/manager/menu"] as const;

const expectedMatrix: Record<(typeof protectedPaths)[number], Record<(typeof allRoles)[number], boolean>> = {
  "/customer/explore": {
    Customer: true,
    Staff: false,
    BranchManager: false,
    BusinessAdmin: false,
  },
  "/staff/scan": {
    Customer: false,
    Staff: true,
    BranchManager: false,
    BusinessAdmin: false,
  },
  "/manager/menu": {
    Customer: false,
    Staff: false,
    BranchManager: true,
    BusinessAdmin: true,
  },
};

describe("role-route access matrix", () => {
  for (const path of protectedPaths) {
    for (const role of allRoles) {
      it(`path=${path} role=${role}`, () => {
        expect(canAccessPath(path, role)).toBe(expectedMatrix[path][role]);
      });
    }
  }

  it("blocks protected routes when role is missing", () => {
    expect(canAccessPath("/customer/explore", undefined)).toBe(false);
    expect(canAccessPath("/staff/scan", undefined)).toBe(false);
    expect(canAccessPath("/manager/menu", undefined)).toBe(false);
  });

  it("allows public routes without role", () => {
    expect(canAccessPath("/login", undefined)).toBe(true);
    expect(canAccessPath("/unauthorized", undefined)).toBe(true);
  });
});
