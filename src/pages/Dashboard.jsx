
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Users,
  Stethoscope,
  CalendarDays,
  Wallet,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";

import {
  initialPatients,
  initialDoctors,
  initialAppointments,
  initialInvoices,
} from "../data/demoData";

import "./Dashboard.css";

// Load charts separately when the dashboard needs them
const DashboardCharts = lazy(
  () => import("../components/dashboard/DashboardCharts")
);

const STORAGE_KEYS = {
  patients: "hospitalPatients",
  doctors: "hospitalDoctors",
  appointments: "hospitalAppointments",
  invoices: "hospitalInvoices",
};

function readStorageData(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);

    if (savedData !== null) {
      const parsedData = JSON.parse(savedData);

      if (Array.isArray(parsedData)) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error(`Unable to load ${key}:`, error);
  }

  return fallback;
}

function getDashboardData() {
  return {
    patients: readStorageData(
      STORAGE_KEYS.patients,
      initialPatients
    ),
    doctors: readStorageData(
      STORAGE_KEYS.doctors,
      initialDoctors
    ),
    appointments: readStorageData(
      STORAGE_KEYS.appointments,
      initialAppointments
    ),
    invoices: readStorageData(
      STORAGE_KEYS.invoices,
      initialInvoices
    ),
  };
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(
    getDashboardData
  );

  const refreshDashboard = useCallback(() => {
    setDashboardData(getDashboardData());
  }, []);

  useEffect(() => {
    window.addEventListener("focus", refreshDashboard);
    window.addEventListener("storage", refreshDashboard);

    return () => {
      window.removeEventListener("focus", refreshDashboard);
      window.removeEventListener("storage", refreshDashboard);
    };
  }, [refreshDashboard]);

  const { patients, doctors, appointments, invoices } =
    dashboardData;

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const appointmentsToday = appointments.filter(
    (appointment) =>
      appointment.date === todayString &&
      appointment.status !== "Cancelled"
  ).length;

  const totalRevenue = invoices.reduce((total, invoice) => {
    if (invoice.status === "Paid") {
      return total + Number(invoice.totalAmount || 0);
    }

    return total;
  }, 0);

  const formattedDate = today.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <h1>Dashboard Overview</h1>
          <p>
            Monitor your hospital activities and manage everything
            in one place.
          </p>
        </div>

        <div className="dashboard-date">
          <CalendarDays size={17} />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Patients"
          value={patients.length.toLocaleString()}
          change="Live records"
          trend="up"
          icon={Users}
          iconColor="green"
        />

        <StatCard
          title="Total Doctors"
          value={doctors.length.toLocaleString()}
          change="Live records"
          trend="up"
          icon={Stethoscope}
          iconColor="purple"
        />

        <StatCard
          title="Appointments Today"
          value={appointmentsToday.toLocaleString()}
          change="Today's schedule"
          trend="up"
          icon={CalendarDays}
          iconColor="orange"
        />

        <StatCard
          title="Total Revenue"
          value={`Rs. ${totalRevenue.toLocaleString()}`}
          change="Paid invoices only"
          trend="up"
          icon={Wallet}
          iconColor="red"
        />
      </div>

      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            style={{
              minHeight: "320px",
              display: "grid",
              placeItems: "center",
              color: "var(--text-secondary)",
            }}
          >
            Loading dashboard charts...
          </div>
        }
      >
        <DashboardCharts
          patients={patients}
          appointments={appointments}
        />
      </Suspense>
    </div>
  );
}

export default Dashboard;
