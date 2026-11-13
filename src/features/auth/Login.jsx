import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { HeartPulse, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

import { useAuth } from "./useAuth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@hospital.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = login(email, password);

      if (result.success) {
        navigate("/dashboard", { replace: true });
      } else {
        setError(result.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        {/* Brand Section */}
        <div className="login-brand">
          <div className="login-logo">
            <HeartPulse size={30} />
          </div>

          <h1>MediCare</h1>
          <p>Hospital Management System</p>
        </div>

        {/* Login Heading */}
        <div className="login-heading">
          <h2>Welcome Back!</h2>
          <p>Please login to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="login-form-group">
            <label htmlFor="login-email">Email Address</label>

            <div className="login-input-wrapper">
              <Mail size={19} />

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-form-group">
            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrapper">
              <LockKeyhole size={19} />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h3>Demo Login Credentials</h3>

          <p>
            <strong>Admin:</strong> admin@hospital.com
          </p>

          <p>
            <strong>Doctor:</strong> doctor@hospital.com
          </p>

          <p>
            <strong>Receptionist:</strong> reception@hospital.com
          </p>
        </div>

        {/* Footer */}
        <p className="login-footer">
          © 2026 MediCare Hospital Management System
        </p>
        </div>
    </main>
  );
}

export default Login;
