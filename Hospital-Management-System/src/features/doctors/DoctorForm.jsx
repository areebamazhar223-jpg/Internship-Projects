import { useState } from "react";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import "./DoctorForm.css";

const emptyForm = {
  name: "",
  specialization: "",
  email: "",
  phone: "",
  gender: "Male",
  qualification: "",
  experience: "",
  department: "",
  consultationFee: "",
  availableDays: [],
  status: "Active",
  address: "",
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function DoctorForm({ isOpen, onClose, onSubmit, initialData }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Doctor" : "Add New Doctor"}
      size="large"
    >
      {isOpen && (
        <DoctorFormFields
          initialData={initialData}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
}

function DoctorFormFields({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initialData,
    availableDays: Array.isArray(initialData?.availableDays)
      ? initialData.availableDays
      : [],
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

  const handleDayChange = (day) => {
    setForm((previous) => ({
      ...previous,
      availableDays: previous.availableDays.includes(day)
        ? previous.availableDays.filter((item) => item !== day)
        : [...previous.availableDays, day],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.specialization.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.qualification.trim() ||
      !form.department.trim() ||
      !form.experience ||
      !form.consultationFee
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\+?[0-9\s()-]{7,15}$/.test(form.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (Number(form.experience) < 0 || Number(form.experience) > 70) {
      setError("Please enter valid years of experience.");
      return;
    }

    if (Number(form.consultationFee) < 0) {
      setError("Consultation fee cannot be negative.");
      return;
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      experience: Number(form.experience),
      consultationFee: Number(form.consultationFee),
    });
  };

  return (
    <form className="doctor-form" onSubmit={handleSubmit}>
      {error && <div className="doctor-form-error">{error}</div>}

      <div className="doctor-form-grid">
        <div className="doctor-form-group">
          <label htmlFor="name">Doctor Name *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter doctor name"
            required
          />
        </div>

        <div className="doctor-form-group">
          <label htmlFor="specialization">Specialization *</label>
          <input
            id="specialization"
            type="text"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="e.g. Cardiologist"
            required
          />
        </div>

        <div className="doctor-form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="doctor@example.com"
            required
          />
        </div>

        <div className="doctor-form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="doctor-form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="doctor-form-group">
          <label htmlFor="qualification">Qualification *</label>
          <input
            id="qualification"
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            placeholder="e.g. MBBS, FCPS"
            required
          />
        </div>

        <div className="doctor-form-group">
          <label htmlFor="experience">Experience (Years) *</label>
          <input
            id="experience"
            type="number"
            name="experience"
            min="0"
            max="70"
            value={form.experience}
            onChange={handleChange}
            placeholder="Years of experience"
            required
          />
        </div>

        <div className="doctor-form-group">
          <label htmlFor="department">Department *</label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Dentistry">Dentistry</option>
            <option value="Gynecology">Gynecology</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>

        <div className="doctor-form-group">
          <label htmlFor="consultationFee">Consultation Fee (PKR) *</label>
          <input
            id="consultationFee"
            type="number"
            name="consultationFee"
            min="0"
            value={form.consultationFee}
            onChange={handleChange}
            placeholder="Enter consultation fee"
            required
          />
        </div>

        <div className="doctor-form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="doctor-form-group full-width">
          <label>Available Days</label>

          <div className="doctor-days-list">
            {weekDays.map((day) => (
              <label className="doctor-day-option" key={day}>
                <input
                  type="checkbox"
                  checked={form.availableDays.includes(day)}
                  onChange={() => handleDayChange(day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="doctor-form-group full-width">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter doctor address"
            rows="3"
          />
        </div>
      </div>

      <div className="doctor-form-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit">
          {initialData ? "Update Doctor" : "Save Doctor"}
        </Button>
      </div>
    </form>
  );
}

export default DoctorForm;
