import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StaffScanPage from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("StaffScanPage", () => {
  it("resolves qr and enables table order navigation", async () => {
    render(<StaffScanPage />);

    fireEvent.change(screen.getByLabelText("QR Raw"), { target: { value: "table:T-12" } });
    fireEvent.click(screen.getByRole("button", { name: "QR Çöz" }));

    await screen.findByText("Masa çözüldü: t-12");

    const openOrderButton = screen.getByRole("button", { name: "Masa Siparişi Aç" });
    expect(openOrderButton).toBeEnabled();

    fireEvent.click(openOrderButton);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/staff/table-orders?tableId=t-12");
    });
  });
});
