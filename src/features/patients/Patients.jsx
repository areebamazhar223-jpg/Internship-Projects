
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Trash2,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import ExportButton from "../../components/common/ExportButton";
import SearchBar from "../../components/common/SearchBar";
import PatientForm from "./PatientForm";
import PatientDetails from "./PatientDetails";
import { initialPatients } from "../../data/demoData";
import { exportToCSV, exportToPDF } from "../../lib/exportData";
import "./Patients.css";

const STORAGE_KEY = "hospitalPatients";
const ITEMS_PER_PAGE = 5;

function getInitialPatients() {
  try {
    const savedPatients = localStorage.getItem(STORAGE_KEY);

    if (savedPatients !== null) {
      const parsedPatients = JSON.parse(savedPatients);

      if (Array.isArray(parsedPatients)) {
        return parsedPatients;
      }
    }
  } catch (error) {
    console.error("Unable to load patient records:", error);
  }

  return initialPatients;
}

function Patients() {
  const [patients, setPatients] = useState(getInitialPatients);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Save patient records in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch (error) {
      console.error("Unable to save patient records:", error);
    }
  }, [patients]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  // Patient statistics
  const totalPatients = patients.length;

  const activePatients = patients.filter(
    (patient) => patient.status === "Active"
  ).length;

  const inactivePatients = patients.filter(
    (patient) => patient.status === "Inactive"
  ).length;

  // Search and status filtering
  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        String(patient.name || "").toLowerCase().includes(term) ||
        String(patient.patientId || "").toLowerCase().includes(term) ||
        String(patient.phone || "").toLowerCase().includes(term) ||
        String(patient.email || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(
    filteredPatients.length / ITEMS_PER_PAGE
  );

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const paginatedPatients = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return filteredPatients.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredPatients, safeCurrentPage]);

  // Open Add Form
  const handleOpenAddForm = () => {
    setEditingPatient(null);
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEditForm = (patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  // Add or Update Patient
  const handleSubmitPatient = (formData) => {
    if (editingPatient) {
      setPatients((currentPatients) =>
        currentPatients.map((patient) =>
          patient.id === editingPatient.id
            ? {
                ...patient,
                ...formData,
                id: patient.id,
                patientId: patient.patientId,
              }
            : patient
        )
      );
    } else {
      const existingNumbers = patients.map((patient) => {
        const match = String(patient.patientId || "").match(/\d+/);
        return match ? Number(match[0]) : 1000;
      });

      const nextNumber = Math.max(1000, ...existingNumbers) + 1;

      const newPatient = {
        ...formData,
        id: Date.now(),
        patientId: `PAT-${nextNumber}`,
        age: Number(formData.age),
        status: formData.status || "Active",
        date:
          formData.date ||
          new Date().toISOString().split("T")[0],
      };

      setPatients((currentPatients) => [
        newPatient,
        ...currentPatients,
      ]);

      setCurrentPage(1);
    }

    setIsFormOpen(false);
    setEditingPatient(null);
  };

  // Close Patient Form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPatient(null);
  };

  // Delete Patient
  const handleDeletePatient = (patient) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}'s record?`
    );

    if (!confirmed) return;

    setPatients((currentPatients) =>
      currentPatients.filter(
        (item) => item.id !== patient.id
      )
    );

    if (selectedPatient?.id === patient.id) {
      setSelectedPatient(null);
      setIsDetailsOpen(false);
    }
  };

  // View Patient Details
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };

  // Close Patient Details
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPatient(null);
  };

  // Columns for CSV and PDF export
  const patientExportColumns = [
    { header: "Patient ID", dataKey: "patientId" },
    { header: "Name", dataKey: "name" },
    { header: "Age", dataKey: "age" },
    { header: "Gender", dataKey: "gender" },
    { header: "Phone", dataKey: "phone" },
    { header: "Email", dataKey: "email" },
    { header: "Blood Group", dataKey: "bloodGroup" },
    { header: "Status", dataKey: "status" },
  ];

  // Export Patients to CSV
  const handleExportPatientsCSV = () => {
    exportToCSV(
      filteredPatients,
      "hospital-patients",
      patientExportColumns
    );
  };

  // Export Patients to PDF
  const handleExportPatientsPDF = async () => {
    try {
      await exportToPDF(
        filteredPatients,
        "hospital-patients-report",
        "Patient Records Report",
        patientExportColumns
      );
    } catch (error) {
      console.error("Unable to export patients PDF:", error);
      window.alert("Unable to generate PDF. Please try again.");
    }
  };

  // Patient Table Columns
  const patientColumns = [
    {
      key: "name",
      label: "Patient",
      render: (value, row) => (
        <div className="patient-name-cell">
          <span className="patient-avatar">
            {String(row.name || "P")
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>

          <div>
            <strong>{value}</strong>
            <div>{row.patientId}</div>
          </div>
        </div>
      ),
    },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "phone", label: "Phone" },
    { key: "bloodGroup", label: "Blood Group" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`patient-status ${
            value === "Active"
              ? "patient-status-active"
              : "patient-status-inactive"
          }`}
        >
          {value || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="patient-actions">
          <button
            type="button"
            className="patient-action-btn"
            aria-label={`View ${row.name}`}
            title="View patient"
            onClick={(event) => {
              event.stopPropagation();
              handleViewPatient(row);
            }}
          >
            <Eye size={14} />
          </button>

          <button
            type="button"
            className="patient-action-btn"
            aria-label={`Edit ${row.name}`}
            title="Edit patient"
            onClick={(event) => {
              event.stopPropagation();
              handleOpenEditForm(row);
            }}
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            className="patient-action-btn delete"
            aria-label={`Delete ${row.name}`}
            title="Delete patient"
            onClick={(event) => {
              event.stopPropagation();
              handleDeletePatient(row);
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const firstRecord =
    filteredPatients.length === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;

  const lastRecord = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredPatients.length
  );

  return (
    <>
      <div className="patients-page">
        {/* Page Header */}
        <div className="patients-header">
          <div className="patients-title">
            <span className="settings-breadcrumb">
              Dashboard / Patients
            </span>

            <h1>Patients</h1>

            <p>
              Manage patient profiles, records, and health history.
            </p>
          </div>

          <button
            type="button"
            className="patients-add-button"
            onClick={handleOpenAddForm}
          >
            <Plus size={16} />
            Add Patient
          </button>
        </div>

        {/* Patient Statistics */}
        <div className="patients-summary">
          <div className="patients-summary-icon">
            <Users size={22} />
          </div>

          <div className="patients-summary-info">
            <span>Total Patients</span>
            <strong>{totalPatients}</strong>
          </div>
        </div>

        <div className="patients-stats-row">
          <div className="patients-stat-item">
            <UserCheck size={19} />
            <div>
              <span>Active Patients</span>
              <strong>{activePatients}</strong>
            </div>
          </div>

          <div className="patients-stat-item">
            <UserX size={19} />
            <div>
              <span>Inactive Patients</span>
              <strong>{inactivePatients}</strong>
            </div>
          </div>
        </div>

        {/* Search, Filter and Export */}
        <div className="patients-toolbar">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, ID, phone or email..."
          />

          <select
            className="patients-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            aria-label="Filter patients by status"
          >
            <option value="All">All Patients</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="patients-export-actions">
            <ExportButton
              onClick={handleExportPatientsCSV}
              label="Export CSV"
            />

            <ExportButton
              onClick={handleExportPatientsPDF}
              label="Export PDF"
            />
          </div>
        </div>

        {/* Patient Table */}
        <div className="patients-table-card">
          <DataTable
            columns={patientColumns}
            data={paginatedPatients}
            emptyMessage="No patients match your search or filter."
            onRowClick={handleViewPatient}
          />

          {/* Pagination Information */}
          {filteredPatients.length > 0 && (
            <div className="patients-pagination-info">
              <span>
                Showing {firstRecord}–{lastRecord} of{" "}
                {filteredPatients.length} patients
              </span>
            </div>
          )}

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Add / Edit Patient Form */}
      {isFormOpen && (
        <PatientForm
          key={editingPatient?.id || "new-patient"}
          isOpen={true}
          onClose={handleCloseForm}
          onSubmit={handleSubmitPatient}
          initialData={editingPatient}
        />
      )}

      {/* Patient Details Modal */}
      {isDetailsOpen && selectedPatient && (
        <PatientDetails
          isOpen={true}
          onClose={handleCloseDetails}
          patient={selectedPatient}
        />
      )}
    </>
  );
}

export default Patients;
