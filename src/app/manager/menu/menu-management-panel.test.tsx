import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ManagerMenuPage from "./page";

describe("ManagerMenuPage", () => {
  it("loads dependency-aware menu/category/product data", async () => {
    const user = userEvent.setup();
    render(<ManagerMenuPage />);

    await screen.findByRole("option", { name: "Kadikoy" });
    await waitFor(() => {
      expect(screen.getAllByText("Main Menu").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Burgers").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Classic Burger").length).toBeGreaterThan(0);
    });

    await user.selectOptions(screen.getByLabelText("Şube"), "b-2");

    await waitFor(() => {
      expect(screen.getAllByText("Lunch Menu").length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(screen.getAllByText("Bowls").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Chicken Bowl").length).toBeGreaterThan(0);
    });
  });
});
