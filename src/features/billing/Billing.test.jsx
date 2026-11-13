import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Billing from "./Billing";
import { initialInvoices } from "../../data/demoData";

describe("Billing status filter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("filters by payment status and combines the filter with search", () => {
    localStorage.setItem("hospitalInvoices", JSON.stringify(initialInvoices));
    render(<Billing />);

    const filter = screen.getByRole("combobox", {
      name: "Filter invoices by payment status",
    });
    const search = screen.getByRole("textbox", {
      name: "Search invoices...",
    });
    const getInvoiceRows = () =>
      screen.getAllByRole("row").slice(1);
    const getStatuses = () =>
      getInvoiceRows().map((row) =>
        within(row).getByText(/^(Paid|Pending|Overdue)$/).textContent
      );

    expect(getInvoiceRows()).toHaveLength(3);

    for (const status of ["Paid", "Pending", "Overdue"]) {
      fireEvent.change(filter, { target: { value: status } });
      expect(getStatuses()).toEqual([status]);
    }

    fireEvent.change(filter, { target: { value: "All" } });
    expect(getInvoiceRows()).toHaveLength(3);

    fireEvent.change(search, { target: { value: "Ahmed" } });
    fireEvent.change(filter, { target: { value: "Paid" } });
    expect(getInvoiceRows()).toHaveLength(1);
    expect(getStatuses()).toEqual(["Paid"]);
    expect(within(getInvoiceRows()[0]).getByText("Ahmed Khan")).toBeInTheDocument();

    expect(localStorage.getItem("hospitalInvoices")).toBe(
      JSON.stringify(initialInvoices)
    );
  });
});
