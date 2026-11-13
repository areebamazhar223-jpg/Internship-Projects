import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <AlertCircle size={42} />
        </div>

        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry! The page you are looking for doesn't exist or may have been
          moved.
        </p>

        <div className="not-found-actions">
          <button
            type="button"
            className="not-found-back"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <Link to="/dashboard" className="not-found-home">
            <Home size={17} />
            Dashboard
          </Link>
        </div>

        <span className="not-found-footer">
          MediCare Hospital Management System
        </span>
      </div>
    </main>
  );
}

export default NotFound;
