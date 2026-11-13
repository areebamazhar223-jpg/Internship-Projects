
import { useState } from "react";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import "./AppointmentForm.css";

const emptyForm = {
  patientName: "",
  doctorName: "",
  date: "",
  time: "",
  type: "General Checkup",
  status: "Pending",
  notes: "",
};

function AppointmentForm({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initialData,
    status:
      initialData?.status === "Scheduled"
        ? "Pending"
        : initialData?.status || "Pending",
  }));
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.patientName.trim() ||
      !form.doctorName.trim() ||
      !form.date ||
      !form.time ||
      !form.type
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    onSubmit({
      ...form,
      patientName: form.patientName.trim(),
      doctorName: form.doctorName.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Reschedule / Edit Appointment" : "Book New Appointment"}
      size="large"
    >
      <form className="appointment-form" onSubmit={handleSubmit}>
        {error && (
          <div className="appointment-form-error">
            {error}
          </div>
        )}

        <div className="appointment-form-grid">
          <div className="appointment-form-group">
            <label htmlFor="patientName">Patient Name *</label>
            <input
              id="patientName"
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
              required
            />
          </div>

          <div className="appointment-form-group">
            <label htmlFor="doctorName">Doctor Name *</label>
            <input
              id="doctorName"
              type="text"
              name="doctorName"
              value={form.doctorName}
              onChange={handleChange}
              placeholder="Enter doctor name"
              required
            />
          </div>

          <div className="appointment-form-group">
            <label htmlFor="date">Appointment Date *</label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="appointment-form-group">
            <label htmlFor="time">Appointment Time *</label>
            <input
              id="time"
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="appointment-form-group">
            <label htmlFor="type">Appointment Type *</label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="General Checkup">General Checkup</option>
              <option value="Dental">Dental</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Emergency">Emergency</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <div className="appointment-form-group">
            <label htmlFor="status">Appointment Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="appointment-form-group full-width">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Enter appointment notes..."
              rows="4"
            />
          </div>
        </div>

        <div className="appointment-form-actions">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            {initialData ? "Update Appointment" : "Save Appointment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AppointmentForm;
