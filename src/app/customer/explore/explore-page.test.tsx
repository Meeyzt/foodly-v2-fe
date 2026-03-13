import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ExplorePage from "./page";

describe("ExplorePage", () => {
  it("filters restaurants with nearby/popular toggles", async () => {
    const user = userEvent.setup();
    render(<ExplorePage />);

    await screen.findByText("Foodly Burger");
    expect(screen.getByText("Anatolian Bowl")).toBeInTheDocument();
    expect(screen.getByText("Pasta Loca")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Yakınındakiler" }));

    await waitFor(() => {
      expect(screen.queryByText("Anatolian Bowl")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Foodly Burger")).toBeInTheDocument();
    expect(screen.getByText("Pasta Loca")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Popüler" }));

    await waitFor(() => {
      expect(screen.queryByText("Pasta Loca")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Foodly Burger")).toBeInTheDocument();
  });
});
