import { useState } from "react";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import "./PatientForm.css";

const emptyForm = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  bloodGroup: "",
  address: "",
  status: "Active",
  medicalHistory: "",
};

function PatientForm({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(() => ({
    ...emptyForm,
    ...initialData,
  }));

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Patient name is required.");
      return;
    }

    if (!formData.age || Number(formData.age) <= 0) {
      setError("Please enter a valid patient age.");
      return;
    }

    if (!formData.gender) {
      setError("Please select patient gender.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      age: Number(formData.age),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    });
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#52645a",
    fontSize: "12px",
    fontWeight: "600",
  };

  const inputStyle = {
    width: "100%",
    minHeight: "42px",
    padding: "10px 12px",
    border: "1px solid #e5ece7",
    borderRadius: "8px",
    outline: "none",
    background: "#ffffff",
    color: "#263d31",
    fontSize: "13px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "17px",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Patient" : "Add New Patient"}
      size="large"
    >
      <form onSubmit={handleSubmit}>
        <div className="patient-form-grid">
          {/* Patient Name */}
          <div style={fieldStyle}>
            <label htmlFor="name" style={labelStyle}>Patient Name *</label>

            <input
              style={inputStyle}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter patient name"
              required
            />
          </div>

          {/* Age */}
          <div style={fieldStyle}>
            <label htmlFor="age" style={labelStyle}>Age *</label>

            <input
              style={inputStyle}
              type="number"
              id="age"
              name="age"
              min="1"
              max="120"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              required
            />
          </div>

          {/* Gender */}
          <div style={fieldStyle}>
            <label htmlFor="gender" style={labelStyle}>Gender *</label>

            <select
              style={inputStyle}
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div style={fieldStyle}>
            <label htmlFor="phone" style={labelStyle}>Phone Number *</label>

            <input
              style={inputStyle}
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="03XXXXXXXXX"
              required
            />
          </div>

          {/* Email */}
          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>Email Address</label>

            <input
              style={inputStyle}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
            />
          </div>

          {/* Blood Group */}
          <div style={fieldStyle}>
            <label htmlFor="bloodGroup" style={labelStyle}>Blood Group</label>

            <select
              style={inputStyle}
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Status */}
          <div style={fieldStyle}>
            <label htmlFor="status" style={labelStyle}>Status</label>

            <select
              style={inputStyle}
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Address */}
          <div style={fieldStyle}>
            <label htmlFor="address" style={labelStyle}>Address</label>

            <input
              style={inputStyle}
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter patient address"
            />
          </div>
        </div>

        {/* Medical History */}
        <div style={fieldStyle}>
          <label htmlFor="medicalHistory" style={labelStyle}>Medical History</label>

          <textarea
            style={{
              ...inputStyle,
              minHeight: "85px",
              resize: "vertical",
            }}
            id="medicalHistory"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            placeholder="Enter medical history or notes..."
          />
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            style={{
              padding: "10px 12px",
              marginBottom: "15px",
              borderRadius: "7px",
              background: "#fff0f0",
              color: "#d35454",
              fontSize: "12px",
            }}
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" type="submit">
            {initialData ? "Update Patient" : "Save Patient"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default PatientForm;
