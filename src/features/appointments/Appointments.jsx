
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Pencil,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import ExportButton from "../../components/common/ExportButton";
import SearchBar from "../../components/common/SearchBar";
import { initialAppointments } from "../../data/demoData";
import { exportToCSV, exportToPDF } from "../../lib/exportData";
import AppointmentForm from "./AppointmentForm";
import "./Appointments.css";

const STORAGE_KEY = "hospitalAppointments";

const normalizeAppointments = (items) =>
  items.map((appointment) => ({
    ...appointment,
    status:
      appointment.status === "Scheduled"
        ? "Pending"
        : appointment.status || "Pending",
  }));

const getAppointments = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? normalizeAppointments(parsed)
        : normalizeAppointments(initialAppointments);
    }

    return normalizeAppointments(initialAppointments);
  } catch {
    return normalizeAppointments(initialAppointments);
  }
};

const isSameAppointment = (first, second) =>
  first.id != null && second.id != null
    ? first.id === second.id
    : first === second;

// Converts appointment date into a local date safely.
const parseAppointmentDate = (dateValue) => {
  if (!dateValue) return null;

  const value = String(dateValue).trim();
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  );
};

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getAppointmentDateKey = (appointment) => {
  const date = parseAppointmentDate(appointment.date);
  return date ? getDateKey(date) : null;
};

function Appointments() {
  const [appointments, setAppointments] = useState(getAppointments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [viewMode, setViewMode] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date())
  );
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (error) {
      console.error("Unable to save appointments:", error);
    }
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !term ||
        appointment.patientName?.toLowerCase().includes(term) ||
        appointment.doctorName?.toLowerCase().includes(term) ||
        appointment.type?.toLowerCase().includes(term) ||
        appointment.date?.toLowerCase().includes(term) ||
        appointment.status?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const pendingCount = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  const confirmedCount = appointments.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const completedCount = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.status === "Cancelled"
  ).length;

  // Build calendar dates, including days from adjacent months.
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(year, month, 1 - firstDay.getDay());
    const endDate = new Date(
      year,
      month,
      lastDay.getDate() + (6 - lastDay.getDay())
    );

    const days = [];

    for (
      const date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date));
    }

    return days;
  }, [currentMonth]);

  const appointmentsByDate = useMemo(() => {
    const grouped = {};

    filteredAppointments.forEach((appointment) => {
      const dateKey = getAppointmentDateKey(appointment);

      if (!dateKey) return;

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(appointment);
    });

    return grouped;
  }, [filteredAppointments]);

  const selectedDateAppointments =
    appointmentsByDate[selectedDate] || [];

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (direction) => {
    setCurrentMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + direction,
          1
        )
    );
    setSelectedAppointment(null);
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentMonth(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );
    setSelectedDate(getDateKey(today));
    setSelectedAppointment(null);
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleSubmitAppointment = (appointmentData) => {
    if (editingAppointment) {
      setAppointments((currentAppointments) =>
        currentAppointments.map((currentAppointment) =>
          isSameAppointment(currentAppointment, editingAppointment)
            ? { ...currentAppointment, ...appointmentData }
            : currentAppointment
        )
      );
    } else {
      const nextId =
        Math.max(
          0,
          ...appointments.map(
            (appointment) => Number(appointment.id) || 0
          )
        ) + 1;

      setAppointments((currentAppointments) => [
        {
          ...appointmentData,
          id: nextId,
        },
        ...currentAppointments,
      ]);
    }

    setIsFormOpen(false);
    setEditingAppointment(null);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = (appointment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the appointment for ${appointment.patientName}?`
    );

    if (!confirmed) return;

    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (item) => !isSameAppointment(item, appointment)
      )
    );

    setSelectedAppointment(null);
  };

  const handleCancelAppointment = (appointment) => {
    const confirmed = window.confirm(
      `Cancel the appointment for ${appointment.patientName}?`
    );

    if (!confirmed) return;

    setAppointments((currentAppointments) =>
      currentAppointments.map((item) =>
        isSameAppointment(item, appointment)
          ? { ...item, status: "Cancelled" }
          : item
      )
    );

    setSelectedAppointment((current) =>
      current && isSameAppointment(current, appointment)
        ? { ...current, status: "Cancelled" }
        : current
    );
  };

  const appointmentExportColumns = [
    { header: "Patient", dataKey: "patientName" },
    { header: "Doctor", dataKey: "doctorName" },
    { header: "Date", dataKey: "date" },
    { header: "Time", dataKey: "time" },
    { header: "Type", dataKey: "type" },
    { header: "Status", dataKey: "status" },
    { header: "Notes", dataKey: "notes" },
  ];

  const handleExportAppointmentsCSV = () => {
    exportToCSV(
      filteredAppointments,
      "hospital-appointments",
      appointmentExportColumns
    );
  };

  const handleExportAppointmentsPDF = () => {
    exportToPDF(
      filteredAppointments,
      "hospital-appointments-report",
      "Appointment Schedule Report",
      appointmentExportColumns
    );
  };

  const appointmentColumns = [
    {
      key: "patientName",
      label: "Patient",
      render: (value, row) => (
        <div className="appointment-patient-cell">
          <strong>{value}</strong>
          <span>{row.type}</span>
        </div>
      ),
    },
    {
      key: "doctorName",
      label: "Doctor",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "time",
      label: "Time",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`appointment-status appointment-status-${value
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, appointment) => (
        <div className="appointment-actions">
          <button
            type="button"
            className="appointment-action-btn"
            title="Edit / Reschedule"
            aria-label={`Edit appointment for ${appointment.patientName}`}
            onClick={(event) => {
              event.stopPropagation();
              handleEditAppointment(appointment);
            }}
          >
            <Pencil size={14} />
          </button>

          {appointment.status !== "Cancelled" &&
            appointment.status !== "Completed" && (
              <button
                type="button"
                className="appointment-action-btn cancel"
                title="Cancel appointment"
                aria-label={`Cancel appointment for ${appointment.patientName}`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleCancelAppointment(appointment);
                }}
              >
                <XCircle size={14} />
              </button>
            )}

          <button
            type="button"
            className="appointment-action-btn delete"
            title="Delete appointment"
            aria-label={`Delete appointment for ${appointment.patientName}`}
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteAppointment(appointment);
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <div className="appointments-title">
          <span className="settings-breadcrumb">
            Dashboard / Appointments
          </span>
          <h1>Appointments</h1>
          <p>Manage patient visits, schedules, and follow-ups.</p>
        </div>

        <button
          type="button"
          className="patients-add-button"
          onClick={handleAddAppointment}
        >
          <Plus size={16} />
          New Appointment
        </button>
      </div>

      <div className="appointments-summary-grid">
        <div className="appointments-summary">
          <div className="appointments-summary-icon">
            <CalendarDays size={22} />
          </div>
          <div className="appointments-summary-info">
            <span>Total Appointments</span>
            <strong>{appointments.length}</strong>
          </div>
        </div>

        <div className="appointments-summary">
          <div className="appointments-summary-icon pending-icon">
            <Clock size={22} />
          </div>
          <div className="appointments-summary-info">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="appointments-summary">
          <div className="appointments-summary-icon confirmed-icon">
            <CheckCircle size={22} />
          </div>
          <div className="appointments-summary-info">
            <span>Confirmed</span>
            <strong>{confirmedCount}</strong>
          </div>
        </div>

        <div className="appointments-summary">
          <div className="appointments-summary-icon completed-icon">
            <CheckCircle size={22} />
          </div>
          <div className="appointments-summary-info">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
        </div>

        <div className="appointments-summary">
          <div className="appointments-summary-icon cancelled-icon">
            <XCircle size={22} />
          </div>
          <div className="appointments-summary-info">
            <span>Cancelled</span>
            <strong>{cancelledCount}</strong>
          </div>
        </div>
      </div>

      <div className="appointments-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search appointments..."
        />

        <div className="appointments-export-actions">
          <ExportButton
            onClick={handleExportAppointmentsCSV}
            label="Export CSV"
          />

          <ExportButton
            onClick={handleExportAppointmentsPDF}
            label="Export PDF"
          />
        </div>
      </div>

      <div className="appointments-filters">
        <label htmlFor="appointment-status-filter">
          Filter by Status
        </label>

        <select
          id="appointment-status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Appointments</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button
          type="button"
          className="appointments-reset-btn"
          onClick={() => {
            setSearch("");
            setStatusFilter("All");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Calendar / Table View Switch */}
      <div className="appointments-view-toolbar">
        <div className="appointments-view-label">
          <CalendarDays size={18} />
          <strong>Appointment Schedule</strong>
        </div>

        <div className="appointments-view-switch">
          <button
            type="button"
            className={viewMode === "calendar" ? "active" : ""}
            onClick={() => setViewMode("calendar")}
          >
            <LayoutGrid size={16} />
            Calendar
          </button>

          <button
            type="button"
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
          >
            <List size={16} />
            Table
          </button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <div className="appointments-calendar-card">
          <div className="calendar-header">
            <div>
              <h2>{monthLabel}</h2>
              <p>View and manage your daily appointments</p>
            </div>

            <div className="calendar-navigation">
              <button
                type="button"
                className="calendar-today-btn"
                onClick={goToToday}
              >
                Today
              </button>

              <button
                type="button"
                className="calendar-nav-btn"
                aria-label="Previous month"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                className="calendar-nav-btn"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          <div className="calendar-legend">
            {["Pending", "Confirmed", "Completed", "Cancelled"].map(
              (status) => (
                <span key={status} className="calendar-legend-item">
                  <i className={`calendar-dot ${status.toLowerCase()}`} />
                  {status}
                </span>
              )
            )}
          </div>

          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div className="calendar-weekday" key={day}>
                  {day}
                </div>
              )
            )}

            {calendarDays.map((date) => {
              const dateKey = getDateKey(date);
              const dayAppointments =
                appointmentsByDate[dateKey] || [];
              const isCurrentMonth =
                date.getMonth() === currentMonth.getMonth();
              const isToday =
                dateKey === getDateKey(new Date());
              const isSelected = dateKey === selectedDate;

              return (
                <div
                  key={dateKey}
                  className={`calendar-day ${
                    !isCurrentMonth ? "outside-month" : ""
                  } ${isToday ? "today" : ""} ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedDate(dateKey);
                    setSelectedAppointment(null);
                  }}
                >
                  <button
                    type="button"
                    className="calendar-date-number"
                    aria-label={`Select ${date.toDateString()}`}
                    onClick={() => {
                      setSelectedDate(dateKey);
                      setSelectedAppointment(null);
                    }}
                  >
                    {date.getDate()}
                  </button>

                  <div className="calendar-day-appointments">
                    {dayAppointments.slice(0, 2).map((appointment, index) => (
                      <button
                        type="button"
                        key={appointment.id ?? `${dateKey}-${index}`}
                        className={`calendar-appointment calendar-${appointment.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        title={`${appointment.patientName} - ${appointment.time || ""}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedDate(dateKey);
                          setSelectedAppointment(appointment);
                        }}
                      >
                        <span className="calendar-appointment-time">
                          {appointment.time || "Time not set"}
                        </span>
                        <span className="calendar-appointment-name">
                          {appointment.patientName}
                        </span>
                      </button>
                    ))}

                    {dayAppointments.length > 2 && (
                      <span className="calendar-more">
                        +{dayAppointments.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Date Appointments */}
          <div className="calendar-selected-section">
            <div className="calendar-selected-heading">
              <div>
                <h3>
                  {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </h3>
                <p>
                  {selectedDateAppointments.length} appointment(s) scheduled
                </p>
              </div>
            </div>

            {selectedDateAppointments.length === 0 ? (
              <div className="calendar-empty">
                <CalendarDays size={28} />
                <p>No appointments scheduled for this date.</p>
              </div>
            ) : (
              <div className="calendar-selected-list">
                {selectedDateAppointments.map((appointment, index) => (
                  <button
                    type="button"
                    key={appointment.id ?? index}
                    className={`calendar-selected-item ${
                      selectedAppointment &&
                      isSameAppointment(selectedAppointment, appointment)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <span className="calendar-selected-time">
                      <Clock size={15} />
                      {appointment.time || "Time not set"}
                    </span>

                    <span className="calendar-selected-patient">
                      <strong>{appointment.patientName}</strong>
                      <small>{appointment.doctorName}</small>
                    </span>

                    <span
                      className={`appointment-status appointment-status-${appointment.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {appointment.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Appointment Details */}
          {selectedAppointment && (
            <div className="calendar-detail-card">
              <div className="calendar-detail-header">
                <div>
                  <h3>Appointment Details</h3>
                  <p>{selectedAppointment.patientName}</p>
                </div>

                <button
                  type="button"
                  className="calendar-detail-close"
                  onClick={() => setSelectedAppointment(null)}
                  aria-label="Close appointment details"
                >
                  <XCircle size={19} />
                </button>
              </div>

              <div className="calendar-detail-grid">
                <div>
                  <span>Patient</span>
                  <strong>{selectedAppointment.patientName}</strong>
                </div>
                <div>
                  <span>Doctor</span>
                  <strong>{selectedAppointment.doctorName}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{selectedAppointment.date}</strong>
                </div>
                <div>
                  <span>Time</span>
                  <strong>{selectedAppointment.time || "Not specified"}</strong>
                </div>
                <div>
                  <span>Appointment Type</span>
                  <strong>{selectedAppointment.type || "General"}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{selectedAppointment.status}</strong>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="calendar-detail-notes">
                  <span>Notes</span>
                  <p>{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="calendar-detail-actions">
                <button
                  type="button"
                  onClick={() => handleEditAppointment(selectedAppointment)}
                >
                  <Pencil size={15} />
                  Edit / Reschedule
                </button>

                {selectedAppointment.status !== "Cancelled" &&
                  selectedAppointment.status !== "Completed" && (
                    <button
                      type="button"
                      className="cancel"
                      onClick={() =>
                        handleCancelAppointment(selectedAppointment)
                      }
                    >
                      <XCircle size={15} />
                      Cancel
                    </button>
                  )}

                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    handleDeleteAppointment(selectedAppointment)
                  }
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="appointments-table-card">
          <DataTable
            columns={appointmentColumns}
            data={filteredAppointments}
            emptyMessage="No appointments match your filters."
          />
        </div>
      )}

      {isFormOpen && (
        <AppointmentForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAppointment(null);
          }}
          onSubmit={handleSubmitAppointment}
          initialData={editingAppointment}
        />
      )}
    </div>
  );
}

export default Appointments;
