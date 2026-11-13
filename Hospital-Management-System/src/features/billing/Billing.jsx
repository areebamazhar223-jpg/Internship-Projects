
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  FileText,
  Plus,
  ReceiptText,
  WalletCards,
  Pencil,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import ExportButton from "../../components/common/ExportButton";
import { exportToCSV, exportToPDF } from "../../lib/exportData";
import { initialInvoices } from "../../data/demoData";
import InvoiceForm from "./InvoiceForm";
import InvoiceDetails from "./InvoiceDetails";
import "./Billing.css";

const INVOICES_STORAGE_KEY = "hospitalInvoices";

function getInitialInvoices() {
  try {
    const savedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);

    if (savedInvoices !== null) {
      const parsedInvoices = JSON.parse(savedInvoices);

      if (Array.isArray(parsedInvoices)) {
        return parsedInvoices;
      }
    }
  } catch (error) {
    console.error("Unable to load invoices:", error);
  }

  return initialInvoices;
}

function Billing() {
  const [invoices, setInvoices] = useState(getInitialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Save invoices whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        INVOICES_STORAGE_KEY,
        JSON.stringify(invoices)
      );
    } catch (error) {
      console.error("Unable to save invoices:", error);
    }
  }, [invoices]);

  // Search invoices
  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !term ||
        String(invoice.invoiceNumber || "").toLowerCase().includes(term) ||
        String(invoice.patientName || "").toLowerCase().includes(term) ||
        String(invoice.status || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  // Open create invoice form
  const handleOpenCreateForm = () => {
    setEditingInvoice(null);
    setIsInvoiceFormOpen(true);
  };

  // Create new invoice
  const handleCreateInvoice = (invoiceData) => {
    const existingNumbers = invoices.map((invoice) => {
      const match = String(invoice.invoiceNumber || "").match(/\d+/);
      return match ? Number(match[0]) : 1000;
    });

    const nextNumber = Math.max(1000, ...existingNumbers) + 1;
    const invoiceNumber = `INV-${nextNumber}`;

    const newInvoice = {
      ...invoiceData,
      id: invoiceNumber,
      invoiceNumber,
      totalAmount: Number(invoiceData.totalAmount || 0),
    };

    setInvoices((currentInvoices) => [
      newInvoice,
      ...currentInvoices,
    ]);

    setIsInvoiceFormOpen(false);
  };

  // Open edit invoice form
  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setIsInvoiceFormOpen(true);
  };

  // Update existing invoice
  const handleUpdateInvoice = (updatedData) => {
    setInvoices((currentInvoices) =>
      currentInvoices.map((invoice) =>
        invoice.id === editingInvoice.id
          ? {
              ...invoice,
              ...updatedData,
              id: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
              totalAmount: Number(updatedData.totalAmount || 0),
            }
          : invoice
      )
    );

    setIsInvoiceFormOpen(false);
    setEditingInvoice(null);
  };

  // Handle form submission
  const handleInvoiceSubmit = (invoiceData) => {
    if (editingInvoice) {
      handleUpdateInvoice(invoiceData);
    } else {
      handleCreateInvoice(invoiceData);
    }
  };

  // Close invoice form
  const handleCloseForm = () => {
    setIsInvoiceFormOpen(false);
    setEditingInvoice(null);
  };

  // Billing statistics
  const totalRevenue = invoices.reduce(
    (sum, invoice) =>
      invoice.status === "Paid"
        ? sum + Number(invoice.totalAmount || 0)
        : sum,
    0
  );

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "Pending"
  ).length;

  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === "Overdue"
  ).length;

  // Export columns
  const invoiceExportColumns = [
    { header: "Invoice Number", dataKey: "invoiceNumber" },
    { header: "Patient", dataKey: "patientName" },
    { header: "Invoice Date", dataKey: "invoiceDate" },
    { header: "Due Date", dataKey: "dueDate" },
    { header: "Total Amount (PKR)", dataKey: "totalAmount" },
    { header: "Status", dataKey: "status" },
  ];

  // Export CSV
  const handleExportCSV = () => {
    exportToCSV(
      filteredInvoices,
      "hospital-invoices",
      invoiceExportColumns
    );
  };

  // Export PDF
  const handleExportPDF = async () => {
    try {
      await exportToPDF(
        filteredInvoices,
        "hospital-invoices-report",
        "Hospital Billing Report",
        invoiceExportColumns
      );
    } catch (error) {
      console.error("Unable to export billing PDF:", error);
      window.alert("Unable to generate PDF. Please try again.");
    }
  };

  // Billing table columns
  const billingColumns = [
    {
      key: "invoiceNumber",
      label: "Invoice",
    },
    {
      key: "patientName",
      label: "Patient",
    },
    {
      key: "invoiceDate",
      label: "Date",
    },
    {
      key: "dueDate",
      label: "Due Date",
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (value) =>
        `PKR ${Number(value || 0).toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`billing-status ${
            value === "Paid"
              ? "billing-status-paid"
              : value === "Pending"
                ? "billing-status-pending"
                : "billing-status-overdue"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, invoice) => (
        <div className="billing-row-actions">
          <button
            type="button"
            className="billing-view-btn"
            aria-label={`View invoice ${invoice.invoiceNumber}`}
            title="View invoice"
            onClick={() => setSelectedInvoice(invoice)}
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            className="billing-edit-btn"
            aria-label={`Edit invoice ${invoice.invoiceNumber}`}
            title="Edit invoice"
            onClick={() => handleEditInvoice(invoice)}
          >
            <Pencil size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="billing-page">
        {/* Page Header */}
        <div className="billing-header">
          <div>
            <span className="settings-breadcrumb">
              Dashboard / Billing
            </span>

            <h1>Billing</h1>

            <p>
              Track revenue, pending payments, and invoice status.
            </p>
          </div>

          <button
            type="button"
            className="billing-add-button"
            onClick={handleOpenCreateForm}
          >
            <Plus size={16} />
            Create Invoice
          </button>
        </div>

        {/* Billing Statistics */}
        <div className="billing-stats">
          <div className="billing-stat-card">
            <div className="billing-stat-icon revenue-icon">
              <WalletCards size={20} />
            </div>

            <div>
              <span className="billing-stat-label">Total Revenue</span>
              <p>PKR {totalRevenue.toLocaleString()}</p>
              <span>Paid invoices only</span>
            </div>
          </div>

          <div className="billing-stat-card">
            <div className="billing-stat-icon invoice-icon">
              <FileText size={20} />
            </div>

            <div>
              <span className="billing-stat-label">Invoices</span>
              <p>{invoices.length}</p>
              <span>Total generated invoices</span>
            </div>
          </div>

          <div className="billing-stat-card">
            <div className="billing-stat-icon paid-icon">
              <ReceiptText size={20} />
            </div>

            <div>
              <span className="billing-stat-label">Paid</span>
              <p>{paidInvoices}</p>
              <span>
                {pendingInvoices} pending · {overdueInvoices} overdue
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="billing-table-card">
          <div className="billing-table-header">
            <div>
              <h2>Invoice Overview</h2>
              <p>Latest billing records</p>
            </div>

            <div className="billing-table-actions">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search invoices..."
              />

              <select
                className="billing-status-filter"
                aria-label="Filter invoices by payment status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Invoices</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>

              <div className="billing-export-actions">
                <ExportButton
                  onClick={handleExportCSV}
                  label="Export CSV"
                />

                <ExportButton
                  onClick={handleExportPDF}
                  label="Export PDF"
                />
              </div>
            </div>
          </div>

          <div className="billing-table-wrapper">
            <DataTable
              columns={billingColumns}
              data={filteredInvoices}
              emptyMessage="No invoices match your search."
            />
          </div>
        </div>
      </div>

      {/* Create / Edit Invoice Form */}
      {isInvoiceFormOpen && (
        <InvoiceForm
          isOpen={isInvoiceFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleInvoiceSubmit}
          initialData={editingInvoice}
        />
      )}

      {/* Invoice Details */}
      {selectedInvoice && (
        <InvoiceDetails
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}
    </>
  );
}

export default Billing;
