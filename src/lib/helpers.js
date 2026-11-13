
/* =================================
   Hospital Management System
   Common Helper Functions
================================= */

// Generate unique ID
export const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Generate patient ID
export const generatePatientId = () => {
  return `PAT-${Date.now().toString().slice(-6)}`;
};

// Generate doctor ID
export const generateDoctorId = () => {
  return `DOC-${Date.now().toString().slice(-6)}`;
};

// Generate appointment ID
export const generateAppointmentId = () => {
  return `APT-${Date.now().toString().slice(-6)}`;
};

// Generate invoice ID
export const generateInvoiceId = () => {
  return `INV-${Date.now().toString().slice(-6)}`;
};

import { readStoredValue } from "./storage";

const getPreferences = () =>
  readStoredValue(
    "hospitalSettings",
    { preferences: { dateFormat: "DD/MM/YYYY", currency: "PKR" } },
    (value) =>
      value !== null &&
      typeof value === "object" &&
      value.preferences !== null &&
      typeof value.preferences === "object",
  ).preferences;

// Format date
export const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00`)
      : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = String(parsedDate.getFullYear());
  const dateFormat = getPreferences().dateFormat;

  if (dateFormat === "MM/DD/YYYY") {
    return `${month}/${day}/${year}`;
  }

  if (dateFormat === "YYYY-MM-DD") {
    return `${year}-${month}-${day}`;
  }

  return `${day}/${month}/${year}`;
};

// Format time
export const formatTime = (time) => {
  if (!time) return "N/A";

  const [hours, minutes] = time.split(":");

  if (
    !Number.isInteger(Number(hours)) ||
    !Number.isInteger(Number(minutes)) ||
    Number(hours) < 0 ||
    Number(hours) > 23 ||
    Number(minutes) < 0 ||
    Number(minutes) > 59
  ) {
    return "N/A";
  }

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Format currency in Pakistani Rupees
export const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "Rs. 0";

  const currency = getPreferences().currency;
  const supportedCurrencies = ["PKR", "USD", "EUR"];

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: supportedCurrencies.includes(currency) ? currency : "PKR",
    maximumFractionDigits: 2,
  }).format(value);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "NA";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

// Capitalize first letter
export const capitalizeFirstLetter = (text) => {
  if (!text || typeof text !== "string") return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Convert text into title case
export const toTitleCase = (text) => {
  if (!text || typeof text !== "string") return "";

  return text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();

  if (birthDate > today) return null;

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Search records by multiple fields
export const searchRecords = (records, searchTerm, fields) => {
  if (!Array.isArray(records)) return [];

  if (!searchTerm?.trim()) return records;

  const searchValue = searchTerm.toLowerCase().trim();

  return records.filter((record) =>
    fields.some((field) =>
      String(record[field] ?? "")
        .toLowerCase()
        .includes(searchValue)
    )
  );
};

// Sort records by field
export const sortRecords = (
  records,
  field,
  direction = "asc"
) => {
  if (!Array.isArray(records)) return [];

  return [...records].sort((a, b) => {
    const valueA = a[field] ?? "";
    const valueB = b[field] ?? "";

    const comparison = String(valueA).localeCompare(
      String(valueB),
      undefined,
      { numeric: true, sensitivity: "base" }
    );

    return direction === "desc" ? -comparison : comparison;
  });
};

// Get status color class
export const getStatusClass = (status) => {
  const normalizedStatus = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  const statusClasses = {
    active: "status-active",
    inactive: "status-inactive",
    scheduled: "status-scheduled",
    completed: "status-completed",
    cancelled: "status-cancelled",
    pending: "status-pending",
    paid: "status-paid",
    unpaid: "status-unpaid",
    "in-progress": "status-in-progress",
  };

  return statusClasses[normalizedStatus] || "status-default";
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  const currentValue = Number(current);
  const previousValue = Number(previous);

  if (
    !Number.isFinite(currentValue) ||
    !Number.isFinite(previousValue)
  ) {
    return 0;
  }

  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return Number(
    (((currentValue - previousValue) / previousValue) * 100).toFixed(2)
  );
};

// Get records count by status
export const countByStatus = (records, status) => {
  if (!Array.isArray(records)) return 0;

  return records.filter(
    (record) =>
      String(record.status).toLowerCase() ===
      String(status).toLowerCase()
  ).length;
};

// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Unable to save data:", error);
    return false;
  }
};

// Get data from localStorage
export const getFromLocalStorage = (key, fallback = null) => {
  try {
    const savedData = localStorage.getItem(key);

    return savedData !== null
      ? JSON.parse(savedData)
      : fallback;
  } catch (error) {
    console.error("Unable to read data:", error);
    return fallback;
  }
};

// Remove data from localStorage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Unable to remove data:", error);
    return false;
  }
};

// Download data as JSON file
export const downloadJSON = (data, filename = "hospital-data.json") => {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

// Get greeting according to current time
export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";

  return "Good Evening";
};
