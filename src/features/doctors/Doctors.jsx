
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Star,
  Stethoscope,
  Users,
  Trash2,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import ExportButton from "../../components/common/ExportButton";
import SearchBar from "../../components/common/SearchBar";
import DoctorForm from "./DoctorForm";
import { initialDoctors } from "../../data/demoData";
import { exportToCSV, exportToPDF } from "../../lib/exportData";
import "./Doctors.css";

const STORAGE_KEY = "hospitalDoctors";

function getDoctors() {
  try {
    const savedDoctors = localStorage.getItem(STORAGE_KEY);

    if (savedDoctors !== null) {
      const parsedDoctors = JSON.parse(savedDoctors);
      return Array.isArray(parsedDoctors) ? parsedDoctors : initialDoctors;
    }

    return initialDoctors;
  } catch {
    return initialDoctors;
  }
}

function Doctors() {
  const [doctors, setDoctors] = useState(getDoctors);
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
  }, [doctors]);

  const specializations = useMemo(() => {
    return [
      ...new Set(
        doctors
          .map((doctor) => doctor.specialization)
          .filter(Boolean)
      ),
    ].sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !term ||
        doctor.name?.toLowerCase().includes(term) ||
        String(doctor.id || "").toLowerCase().includes(term) ||
        doctor.specialization?.toLowerCase().includes(term) ||
        doctor.department?.toLowerCase().includes(term);

      const matchesSpecialization =
        specializationFilter === "All" ||
        doctor.specialization === specializationFilter;

      const matchesStatus =
        statusFilter === "All" || doctor.status === statusFilter;

      return matchesSearch && matchesSpecialization && matchesStatus;
    });
  }, [doctors, search, specializationFilter, statusFilter]);

  const activeDoctors = doctors.filter(
    (doctor) => doctor.status === "Active"
  ).length;

  const inactiveDoctors = doctors.length - activeDoctors;

  const departmentCount = new Set(
    doctors.map((doctor) => doctor.department).filter(Boolean)
  ).size;

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setIsFormOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleSubmitDoctor = (formData) => {
    if (editingDoctor) {
      setDoctors((currentDoctors) =>
        currentDoctors.map((doctor) =>
          doctor.id === editingDoctor.id
            ? { ...doctor, ...formData }
            : doctor
        )
      );
    } else {
      const existingIds = doctors
        .map((doctor) =>
          Number(String(doctor.id).match(/\d+/)?.[0] || 0)
        )
        .filter(Boolean);

      const nextNumber = existingIds.length
        ? Math.max(...existingIds) + 1
        : 1;

      const newDoctor = {
        ...formData,
        id: `DOC-${String(nextNumber).padStart(3, "0")}`,
        status: formData.status || "Active",
      };

      setDoctors((currentDoctors) => [newDoctor, ...currentDoctors]);
    }

    setIsFormOpen(false);
    setEditingDoctor(null);
  };

  const handleDeleteDoctor = (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctor.name}?`
    );

    if (!confirmed) return;

    setDoctors((currentDoctors) =>
      currentDoctors.filter((item) => item.id !== doctor.id)
    );
  };

  const doctorExportColumns = [
    { header: "Doctor ID", dataKey: "id" },
    { header: "Name", dataKey: "name" },
    { header: "Specialty", dataKey: "specialization" },
    { header: "Department", dataKey: "department" },
    { header: "Experience", dataKey: "experience" },
    { header: "Consultation Fee", dataKey: "consultationFee" },
    { header: "Status", dataKey: "status" },
  ];

  const handleExportDoctorsCSV = () => {
    exportToCSV(
      filteredDoctors,
      "hospital-doctors",
      doctorExportColumns
    );
  };

  const handleExportDoctorsPDF = async () => {
    try {
      await exportToPDF(
        filteredDoctors,
        "hospital-doctors-report",
        "Doctor Directory Report",
        doctorExportColumns
      );
    } catch (error) {
      console.error("Doctor PDF export failed:", error);
      window.alert("Unable to export PDF. Please try again.");
    }
  };

  const doctorColumns = [
    {
      key: "name",
      label: "Doctor",
      render: (value, row) => (
        <div className="patient-name-cell">
          <span className="patient-avatar">
            {row.name
              ?.split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>

          <div>
            <strong>{value}</strong>
            <div>{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      label: "Specialty",
    },
    {
      key: "department",
      label: "Department",
    },
    {
      key: "experience",
      label: "Experience",
    },
    {
      key: "consultationFee",
      label: "Fee",
      render: (value) => `PKR ${Number(value || 0).toLocaleString()}`,
    },
    {
      key: "status",
      label: "Availability",
      render: (value) => (
        <span
          className={`patient-status ${
            value === "Active"
              ? "patient-status-active"
              : "patient-status-inactive"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          type="button"
          className="doctor-delete-btn"
          title="Delete doctor"
          aria-label={`Delete ${row.name}`}
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteDoctor(row);
          }}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="doctors-page">
        <div className="doctors-header">
          <div>
            <span className="doctors-breadcrumb">
              Dashboard / Doctors
            </span>

            <h1>Doctors</h1>
            <p>Review doctor profiles, departments, and availability.</p>
          </div>

          <button
            type="button"
            className="doctors-add-btn"
            onClick={handleAddDoctor}
          >
            <Plus size={16} />
            Add Doctor
          </button>
        </div>

        <div className="doctors-stats">
          <div className="doctors-stat-card">
            <div className="doctors-stat-icon total-doctors-icon">
              <Stethoscope size={22} />
            </div>
            <div>
              <span>Total Doctors</span>
              <p className="doctors-stat-value">{doctors.length}</p>
            </div>
          </div>

          <div className="doctors-stat-card">
            <div className="doctors-stat-icon active-doctors-icon">
              <Users size={22} />
            </div>
            <div>
              <span>Active</span>
              <p className="doctors-stat-value">{activeDoctors}</p>
            </div>
          </div>

          <div className="doctors-stat-card">
            <div className="doctors-stat-icon inactive-doctors-icon">
              <Search size={22} />
            </div>
            <div>
              <span>Inactive</span>
              <p className="doctors-stat-value">{inactiveDoctors}</p>
            </div>
          </div>

          <div className="doctors-stat-card">
            <div className="doctors-stat-icon department-icon">
              <Star size={22} />
            </div>
            <div>
              <span>Departments</span>
              <p className="doctors-stat-value">{departmentCount}</p>
            </div>
          </div>
        </div>

        <div className="doctors-table-card">
          <div className="doctors-table-header">
            <div>
              <h2>Doctor Directory</h2>
              <p>Manage your hospital doctors</p>
            </div>

            <span className="doctors-count">
              {filteredDoctors.length} Found
            </span>
          </div>

          <div className="doctors-toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search doctors..."
            />

            <div className="doctors-export-actions">
              <ExportButton
                onClick={handleExportDoctorsCSV}
                label="Export CSV"
              />

              <ExportButton
                onClick={handleExportDoctorsPDF}
                label="Export PDF"
              />
            </div>
          </div>

          <div className="doctors-filters">
            <div className="doctors-filter-group">
              <label htmlFor="specialization-filter">
                Specialization
              </label>

              <select
                id="specialization-filter"
                value={specializationFilter}
                onChange={(event) =>
                  setSpecializationFilter(event.target.value)
                }
              >
                <option value="All">All Specializations</option>

                {specializations.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="doctors-filter-group">
              <label htmlFor="status-filter">Availability</label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button
              type="button"
              className="doctors-reset-btn"
              onClick={() => {
                setSearch("");
                setSpecializationFilter("All");
                setStatusFilter("All");
              }}
            >
              Reset Filters
            </button>
          </div>

          <DataTable
            columns={doctorColumns}
            data={filteredDoctors}
            emptyMessage="No doctors match your filters."
            onRowClick={handleEditDoctor}
          />
        </div>
      </div>

      <DoctorForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDoctor(null);
        }}
        onSubmit={handleSubmitDoctor}
        initialData={editingDoctor}
      />
    </>
  );
}

export default Doctors;
