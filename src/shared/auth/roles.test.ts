import { describe, expect, it } from "vitest";
import { canAccessPath } from "./roles";

describe("canAccessPath", () => {
  it("allows customer routes for customer", () => {
    expect(canAccessPath("/customer/explore", "Customer")).toBe(true);
  });

  it("blocks staff routes for customer", () => {
    expect(canAccessPath("/staff/scan", "Customer")).toBe(false);
  });

  it("allows manager routes for business admin", () => {
    expect(canAccessPath("/manager/menu", "BusinessAdmin")).toBe(true);
  });
});
