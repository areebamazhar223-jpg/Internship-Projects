import {
  UserRound,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Droplet,
  FileText,
} from "lucide-react";

import Modal from "../../components/common/Modal";
import "./PatientDetails.css";

function PatientDetails({ isOpen, onClose, patient }) {
  if (!patient) return null;

  const detailStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "13px",
    background: "#f7faf8",
    border: "1px solid #edf1ee",
    borderRadius: "9px",
  };

  const labelStyle = {
    color: "#89958e",
    fontSize: "11px",
  };

  const valueStyle = {
    color: "#183c2d",
    fontSize: "13px",
    fontWeight: "600",
    overflowWrap: "anywhere",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Patient Details"
      size="large"
    >
      {/* Patient Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          padding: "17px",
          marginBottom: "22px",
          background: "#f0f8f4",
          borderRadius: "11px",
        }}
      >
        <div
          style={{
            width: "55px",
            height: "55px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "#dcefe5",
            color: "#08764f",
          }}
        >
          <UserRound size={27} />
        </div>

        <div>
          <h3 style={{ fontSize: "18px", marginBottom: "5px" }}>
            {patient.name}
          </h3>

          <p style={{ color: "#89958e", fontSize: "12px" }}>
            Patient ID: {patient.patientId}
          </p>
        </div>
      </div>

      {/* Patient Information */}
      <h4 style={{ marginBottom: "13px", fontSize: "14px" }}>
        Personal Information
      </h4>

      <div className="patient-details-grid">
        <div style={detailStyle}>
          <span style={labelStyle}>Age</span>
          <strong style={valueStyle}>{patient.age} years</strong>
        </div>

        <div style={detailStyle}>
          <span style={labelStyle}>Gender</span>
          <strong style={valueStyle}>{patient.gender || "—"}</strong>
        </div>

        <div style={detailStyle}>
          <span style={labelStyle}>
            <Phone size={13} /> Phone Number
          </span>
          <strong style={valueStyle}>{patient.phone || "—"}</strong>
        </div>

        <div style={detailStyle}>
          <span style={labelStyle}>
            <Mail size={13} /> Email Address
          </span>
          <strong style={valueStyle}>{patient.email || "—"}</strong>
        </div>

        <div style={detailStyle}>
          <span style={labelStyle}>
            <Droplet size={13} /> Blood Group
          </span>
          <strong style={valueStyle}>
            {patient.bloodGroup || "Not provided"}
          </strong>
        </div>

        <div style={detailStyle}>
          <span style={labelStyle}>Status</span>
          <strong
            style={{
              ...valueStyle,
              color: patient.status === "Active" ? "#08764f" : "#d35454",
            }}
          >
            {patient.status || "—"}
          </strong>
        </div>

        <div style={detailStyle}>
          <span style={labelStyle}>
            <CalendarDays size={13} /> Registration Date
          </span>
          <strong style={valueStyle}>{patient.date || "—"}</strong>
        </div>

        <div style={detailStyle}>
          <span style={labelStyle}>
            <MapPin size={13} /> Address
          </span>
          <strong style={valueStyle}>
            {patient.address || "Not provided"}
          </strong>
        </div>
      </div>

      {/* Medical History */}
      <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>
        Medical History
      </h4>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "15px",
          border: "1px solid #edf1ee",
          borderRadius: "9px",
          background: "#ffffff",
          marginBottom: "20px",
        }}
      >
        <FileText size={20} color="#08764f" style={{ flexShrink: 0 }} />

        <p
          style={{
            color: "#64736b",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          {patient.medicalHistory || "No medical history available."}
        </p>
      </div>

      {/* Close */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "10px 22px",
            border: "none",
            borderRadius: "8px",
            background: "#08764f",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default PatientDetails;
