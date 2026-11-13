
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "./Settings";

describe("Settings Component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders the Settings page correctly", () => {
    render(<Settings />);

    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Profile Settings"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Hospital Information"),
    ).toBeInTheDocument();
  });

  it("shows validation message when profile name is empty", () => {
    render(<Settings />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: " " },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /save profile/i }),
    );

    expect(
      screen.getByText("Name and email are required."),
    ).toBeInTheDocument();
  });

  it("saves updated profile information", () => {
    render(<Settings />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test Admin" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /save profile/i }),
    );

    expect(
      screen.getByText("Profile updated successfully!"),
    ).toBeInTheDocument();
  });

  it("enables dark mode when the toggle is clicked", () => {
    render(<Settings />);

    const checkboxes = screen.getAllByRole("checkbox");
    const darkModeToggle = checkboxes[4];

    fireEvent.click(darkModeToggle);

    expect(darkModeToggle).toBeChecked();
    expect(document.documentElement).toHaveClass("dark-theme");
  });
});
