
import { useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import "./InvoiceForm.css";

const createInitialForm = () => ({
  patientName: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  description: "",
  amount: "",
  discount: "0",
  tax: "0",
  paymentMethod: "Cash",
  status: "Pending",
  notes: "",
});

function InvoiceForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const isEditMode = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Invoice" : "Create New Invoice"}
      size="large"
    >
      {isOpen && (
        <InvoiceFormFields
          key={initialData?.id ?? "new"}
          initialData={initialData}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
}

function InvoiceFormFields({ initialData, onClose, onSubmit }) {
  const [formData, setFormData] = useState(() => ({
    ...createInitialForm(),
    ...initialData,

    patientName: initialData?.patientName ?? "",
    invoiceDate:
      initialData?.invoiceDate ??
      new Date().toISOString().slice(0, 10),
    dueDate: initialData?.dueDate ?? "",
    description: initialData?.description ?? "",
    amount: String(initialData?.amount ?? ""),
    discount: String(initialData?.discount ?? 0),
    tax: String(initialData?.tax ?? 0),
    paymentMethod: initialData?.paymentMethod ?? "Cash",
    status: initialData?.status ?? "Pending",
    notes: initialData?.notes ?? "",
  }));

  const [error, setError] = useState("");

  const isEditMode = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.patientName.trim() ||
      !formData.invoiceDate ||
      !formData.description.trim() ||
      formData.amount === ""
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const amount = Number(formData.amount);
    const discount = Number(formData.discount);
    const tax = Number(formData.tax);

    if (
      !Number.isFinite(amount) ||
      !Number.isFinite(discount) ||
      !Number.isFinite(tax) ||
      amount <= 0 ||
      discount < 0 ||
      tax < 0 ||
      discount > 100 ||
      tax > 100
    ) {
      setError(
        "Enter a valid amount. Discount and tax must be between 0 and 100."
      );
      return;
    }

    if (
      formData.dueDate &&
      formData.dueDate < formData.invoiceDate
    ) {
      setError("The due date cannot be before the invoice date.");
      return;
    }

    const discountedAmount =
      amount - (amount * discount) / 100;

    const invoiceData = {
      ...initialData,
      ...formData,

      patientName: formData.patientName.trim(),
      description: formData.description.trim(),
      amount,
      discount,
      tax,

      totalAmount:
        discountedAmount +
        (discountedAmount * tax) / 100,
    };

    onSubmit(invoiceData);
    onClose();
  };

  return (
    <form className="invoice-form" onSubmit={handleSubmit}>
      {error && (
        <div className="invoice-form-error" role="alert">
          {error}
        </div>
      )}

      <div className="invoice-form-grid">
        <div className="invoice-form-group">
          <label htmlFor="patientName">Patient Name *</label>
          <input
            id="patientName"
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
        </div>

        <div className="invoice-form-group">
          <label htmlFor="invoiceDate">Invoice Date *</label>
          <input
            id="invoiceDate"
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="invoice-form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={formData.invoiceDate}
          />
        </div>

        <div className="invoice-form-group">
          <label htmlFor="amount">Amount (PKR) *</label>
          <input
            id="amount"
            type="number"
            name="amount"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="invoice-form-group">
          <label htmlFor="discount">Discount (%)</label>
          <input
            id="discount"
            type="number"
            name="discount"
            min="0"
            max="100"
            step="0.01"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>

        <div className="invoice-form-group">
          <label htmlFor="tax">Tax (%)</label>
          <input
            id="tax"
            type="number"
            name="tax"
            min="0"
            max="100"
            step="0.01"
            value={formData.tax}
            onChange={handleChange}
          />
        </div>

        <div className="invoice-form-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <div className="invoice-form-group">
          <label htmlFor="status">Payment Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="invoice-form-group full-width">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter invoice description"
            rows="3"
            required
          />
        </div>

        <div className="invoice-form-group full-width">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter additional notes"
            rows="3"
          />
        </div>
      </div>

      <div className="invoice-form-actions">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit">
          {isEditMode ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}

export default InvoiceForm;
