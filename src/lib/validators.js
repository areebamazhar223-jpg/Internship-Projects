
/* ================================
   Common Validation Functions
================================ */

// Check required field
export const isRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== "";
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim());
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[0-9\s()-]{7,15}$/;
  return phoneRegex.test(String(phone).trim());
};

// Validate password
export const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

// Validate positive number
export const isPositiveNumber = (value) => {
  return Number.isFinite(Number(value)) && Number(value) > 0;
};

// Validate age
export const isValidAge = (age) => {
  const value = Number(age);
  return Number.isInteger(value) && value >= 0 && value <= 120;
};

// Validate date
export const isValidDate = (date) => {
  if (!date) return false;

  const parsedDate = new Date(`${date}T00:00:00`);
  return !Number.isNaN(parsedDate.getTime());
};

// Validate appointment time
export const isValidTime = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(String(time));
};

// Validate gender
export const isValidGender = (gender) => {
  return ["Male", "Female", "Other"].includes(gender);
};

// Validate appointment status
export const isValidAppointmentStatus = (status) => {
  return ["Scheduled", "Completed", "Cancelled"].includes(status);
};

// Validate blood group
export const isValidBloodGroup = (bloodGroup) => {
  return [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ].includes(bloodGroup);
};

// Validate amount
export const isValidAmount = (amount) => {
  return Number.isFinite(Number(amount)) && Number(amount) >= 0;
};

// Validate name
export const isValidName = (name) => {
  const value = String(name || "").trim();

  return (
    value.length >= 2 &&
    value.length <= 60 &&
    /^[\p{L}\s.'-]+$/u.test(value)
  );
};

// Validate form fields
export const validateRequiredFields = (data, fields) => {
  const errors = {};

  fields.forEach((field) => {
    if (!isRequired(data[field])) {
      errors[field] = `${field} is required`;
    }
  });

  return errors;
};

// Validate patient form
export const validatePatient = (patient) => {
  const errors = {};

  if (!isValidName(patient.name)) {
    errors.name = "Please enter a valid patient name.";
  }

  if (!isValidAge(patient.age)) {
    errors.age = "Please enter a valid age.";
  }

  if (!isValidGender(patient.gender)) {
    errors.gender = "Please select a valid gender.";
  }

  if (!isValidPhone(patient.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (patient.email && !isValidEmail(patient.email)) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
};

// Validate appointment form
export const validateAppointment = (appointment) => {
  const errors = {};

  if (!isRequired(appointment.patientName)) {
    errors.patientName = "Patient name is required.";
  }

  if (!isRequired(appointment.doctorName)) {
    errors.doctorName = "Doctor name is required.";
  }

  if (!isValidDate(appointment.date)) {
    errors.date = "Please select a valid appointment date.";
  }

  if (!isValidTime(appointment.time)) {
    errors.time = "Please select a valid appointment time.";
  }

  if (!isRequired(appointment.type)) {
    errors.type = "Appointment type is required.";
  }

  return errors;
};

// Validate login form
export const validateLogin = (credentials) => {
  const errors = {};

  if (!isValidEmail(credentials.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!isRequired(credentials.password)) {
    errors.password = "Password is required.";
  }

  return errors;
};

// Check whether form has errors
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
