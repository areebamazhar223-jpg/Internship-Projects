
import { lazy, Suspense } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../features/auth/ProtectedRoute";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../features/auth/Login"));

const Patients = lazy(() => import("../features/patients/Patients"));
const Doctors = lazy(() => import("../features/doctors/Doctors"));
const Appointments = lazy(
  () => import("../features/appointments/Appointments")
);
const Billing = lazy(() => import("../features/billing/Billing"));
const Settings = lazy(() => import("../features/settings/Settings"));
const Wards = lazy(() => import("../features/wards/Wards"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            style={{
              minHeight: "100vh",
              display: "grid",
              placeItems: "center",
              color: "var(--text-secondary)",
              fontSize: "14px",
            }}
          >
            Loading page...
          </div>
        }
      >
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              {/* Patients */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "Admin",
                      "Doctor",
                      "Receptionist",
                    ]}
                  />
                }
              >
                <Route
                  path="/patients"
                  element={<Patients />}
                />
              </Route>

              {/* Other Modules */}
              <Route path="/doctors" element={<Doctors />} />

              <Route
                path="/appointments"
                element={<Appointments />}
              />

              <Route path="/billing" element={<Billing />} />

              {/* Ward & Bed Management */}
              <Route path="/wards" element={<Wards />} />

              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
