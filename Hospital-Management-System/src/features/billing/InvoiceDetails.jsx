import { FileText, User, CreditCard, Printer, X } from "lucide-react";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import "./InvoiceDetails.css";

function InvoiceDetails({ isOpen, onClose, invoice }) {
  if (!isOpen || !invoice) return null;

  const amount = Number(invoice.amount) || 0;
  const discount = Number(invoice.discount) || 0;
  const tax = Number(invoice.tax) || 0;

  const discountedAmount = amount - (amount * discount) / 100;
  const totalAmount =
    invoice.totalAmount ?? discountedAmount + (discountedAmount * tax) / 100;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 2,
    }).format(value);

  const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const status = invoice.status || "Pending";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invoice Details"
      size="large"
    >
      <div className="invoice-details">
        <div className="invoice-details-header">
          <div className="invoice-details-brand">
            <div className="invoice-details-icon">
              <FileText size={25} />
            </div>

            <div>
              <h2>Hospital Invoice</h2>
              <p>Payment and billing information</p>
            </div>
          </div>

          <span
            className={`invoice-details-status invoice-status-${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {status}
          </span>
        </div>

        <div className="invoice-details-number">
          <div>
            <span>Invoice Number</span>
            <h3>{invoice.invoiceNumber || invoice.id || "N/A"}</h3>
          </div>

          <div>
            <span>Invoice Date</span>
            <h3>{formatDate(invoice.invoiceDate)}</h3>
          </div>
        </div>

        <div className="invoice-details-section">
          <h3>
            <User size={18} />
            Patient Information
          </h3>

          <div className="invoice-details-info">
            <div>
              <span>Patient Name</span>
              <strong>{invoice.patientName || "N/A"}</strong>
            </div>

            <div>
              <span>Due Date</span>
              <strong>{formatDate(invoice.dueDate)}</strong>
            </div>
          </div>
        </div>

        <div className="invoice-details-section">
          <h3>
            <FileText size={18} />
            Invoice Description
          </h3>

          <p className="invoice-details-description">
            {invoice.description || "No description available."}
          </p>
        </div>

        <div className="invoice-details-section">
          <h3>
            <CreditCard size={18} />
            Payment Information
          </h3>

          <div className="invoice-details-info">
            <div>
              <span>Payment Method</span>
              <strong>{invoice.paymentMethod || "Cash"}</strong>
            </div>

            <div>
              <span>Payment Status</span>
              <strong>{status}</strong>
            </div>
          </div>
        </div>

        <div className="invoice-details-section">
          <h3>Amount Summary</h3>

          <div className="invoice-amount-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>

          <div className="invoice-amount-row">
            <span>Discount ({discount}%)</span>
            <strong>- {formatCurrency(amount * (discount / 100))}</strong>
          </div>

          <div className="invoice-amount-row">
            <span>Tax ({tax}%)</span>
            <strong>{formatCurrency(discountedAmount * (tax / 100))}</strong>
          </div>

          <div className="invoice-amount-total">
            <span>Total Amount</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>
        </div>

        {invoice.notes && (
          <div className="invoice-details-section">
            <h3>Additional Notes</h3>
            <p className="invoice-details-description">{invoice.notes}</p>
          </div>
        )}

        <div className="invoice-details-actions">
          <Button variant="secondary" onClick={onClose}>
            <X size={16} />
            Close
          </Button>

          <Button onClick={handlePrint}>
            <Printer size={16} />
            Print Invoice
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default InvoiceDetails;
