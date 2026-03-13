import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StaffStockPage from "./page";

describe("StaffStockPage", () => {
  it("loads and renders stock list", async () => {
    render(<StaffStockPage />);

    fireEvent.click(screen.getByRole("button", { name: "Stok Durumunu Getir" }));

    await screen.findByText(/Cheeseburger/);
    expect(screen.getByText(/Ayran/)).toBeInTheDocument();
    expect(screen.getByText(/Mozzarella Sticks/)).toBeInTheDocument();
    expect(screen.getByText(/Ayran .* Kritik/)).toBeInTheDocument();
    expect(screen.getByText(/Mozzarella Sticks .* Tükendi/)).toBeInTheDocument();
  });
});
