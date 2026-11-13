
import { useEffect, useState } from "react";
import {
  UserRound,
  Building2,
  Bell,
  ShieldCheck,
  Palette,
  SlidersHorizontal,
  Save,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import useLocalStorage from "../../hooks/useLocalStorage";
import "./Settings.css";

const defaultSettings = {
  profile: {
    name: "Hospital Admin",
    email: "admin@hospital.com",
    phone: "",
    role: "Admin",
  },
  hospital: {
    name: "City Care Hospital",
    email: "",
    phone: "",
    address: "",
  },
  notifications: {
    appointments: true,
    billing: true,
    newPatients: true,
    emailNotifications: false,
  },
  preferences: {
    theme: "light",
    dateFormat: "DD/MM/YYYY",
    currency: "PKR",
  },
};

const isSettings = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  ["profile", "hospital", "notifications", "preferences"].every(
    (key) =>
      value[key] !== null &&
      typeof value[key] === "object" &&
      !Array.isArray(value[key]),
  );

function Settings() {
  const [settings, setSettings] = useLocalStorage(
    "hospitalSettings",
    defaultSettings,
    isSettings,
  );

  const [profile, setProfile] = useState(() => ({
    ...defaultSettings.profile,
    ...settings.profile,
  }));

  const [hospital, setHospital] = useState(() => ({
    ...defaultSettings.hospital,
    ...settings.hospital,
  }));

  const [notifications, setNotifications] = useState(() => ({
    ...defaultSettings.notifications,
    ...settings.notifications,
  }));

  const [preferences, setPreferences] = useState(() => ({
    ...defaultSettings.preferences,
    ...settings.preferences,
  }));

  const [profileMessage, setProfileMessage] = useState("");
  const [hospitalMessage, setHospitalMessage] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Apply Dark Mode Globally
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle(
      "dark-theme",
      preferences.theme === "dark",
    );
  }, [preferences.theme]);

  const saveProfile = (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      setProfileMessage("Name and email are required.");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      profile: { ...profile },
    }));

    setProfileMessage("Profile updated successfully!");
  };

  const saveHospital = (e) => {
    e.preventDefault();

    if (!hospital.name.trim()) {
      setHospitalMessage("Hospital name is required.");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      hospital: { ...hospital },
    }));

    setHospitalMessage("Hospital information saved successfully!");
  };

  const handleNotificationChange = (name) => {
    const updatedNotifications = {
      ...notifications,
      [name]: !notifications[name],
    };

    setNotifications(updatedNotifications);

    setSettings((prev) => ({
      ...prev,
      notifications: updatedNotifications,
    }));
  };

  const handlePreferenceChange = (name, value) => {
    const updatedPreferences = {
      ...preferences,
      [name]: value,
    };

    setPreferences(updatedPreferences);

    setSettings((prev) => ({
      ...prev,
      preferences: updatedPreferences,
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setSecurityMessage("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setSecurityMessage("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSecurityMessage(
        "New password must be at least 6 characters.",
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSecurityMessage("New passwords do not match.");
      return;
    }

    setSecurityMessage(
      "Demo only: password changes are not connected to authentication.",
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setProfileMessage("");
  };

  const handleHospitalChange = (e) => {
    const { name, value } = e.target;

    setHospital((prev) => ({
      ...prev,
      [name]: value,
    }));

    setHospitalMessage("");
  };

  return (
    <div
      className={`settings-page ${
        preferences.theme === "dark" ? "settings-dark" : ""
      }`}
    >
      <div className="settings-header">
        <div>
          <span className="settings-breadcrumb">
            Dashboard / Settings
          </span>
          <h1>Settings</h1>
          <p>Manage your account and hospital preferences.</p>
        </div>

        <div className="settings-admin-badge">
          <div className="settings-admin-avatar">
            <UserRound size={21} />
          </div>
          <div>
            <strong>{profile.name}</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>

      <div className="settings-content">
        {/* Profile Settings */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon profile-icon">
              <UserRound size={21} />
            </div>
            <div>
              <h2>Profile Settings</h2>
              <p>Update your personal account information.</p>
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <div className="settings-form-grid">
              <div className="settings-field">
                <label htmlFor="profileName">Full Name</label>
                <input
                  id="profileName"
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="profileEmail">Email Address</label>
                <input
                  id="profileEmail"
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="profilePhone">Phone Number</label>
                <input
                  id="profilePhone"
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="profileRole">Account Role</label>
                <input
                  id="profileRole"
                  type="text"
                  value={profile.role}
                  readOnly
                />
              </div>
            </div>

            {profileMessage && (
              <p className="settings-message">{profileMessage}</p>
            )}

            <div className="settings-actions">
              <button type="submit" className="settings-save-btn">
                <Save size={16} />
                Save Profile
              </button>
            </div>
          </form>
        </section>

        {/* Hospital Information */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon hospital-icon">
              <Building2 size={21} />
            </div>
            <div>
              <h2>Hospital Information</h2>
              <p>Manage your hospital's basic information.</p>
            </div>
          </div>

          <form onSubmit={saveHospital}>
            <div className="settings-form-grid">
              <div className="settings-field">
                <label htmlFor="hospitalName">Hospital Name</label>
                <input
                  id="hospitalName"
                  type="text"
                  name="name"
                  value={hospital.name}
                  onChange={handleHospitalChange}
                  placeholder="Enter hospital name"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="hospitalEmail">Hospital Email</label>
                <input
                  id="hospitalEmail"
                  type="email"
                  name="email"
                  value={hospital.email}
                  onChange={handleHospitalChange}
                  placeholder="Enter hospital email"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="hospitalPhone">Contact Number</label>
                <input
                  id="hospitalPhone"
                  type="tel"
                  name="phone"
                  value={hospital.phone}
                  onChange={handleHospitalChange}
                  placeholder="Enter contact number"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="hospitalAddress">Hospital Address</label>
                <input
                  id="hospitalAddress"
                  type="text"
                  name="address"
                  value={hospital.address}
                  onChange={handleHospitalChange}
                  placeholder="Enter hospital address"
                />
              </div>
            </div>

            {hospitalMessage && (
              <p className="settings-message">{hospitalMessage}</p>
            )}

            <div className="settings-actions">
              <button type="submit" className="settings-save-btn">
                <Save size={16} />
                Save Hospital Information
              </button>
            </div>
          </form>
        </section>

        {/* Notifications */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon notification-icon">
              <Bell size={21} />
            </div>
            <div>
              <h2>Notification Settings</h2>
              <p>Choose which notifications you want to enable.</p>
            </div>
          </div>

          <div className="settings-options">
            {[
              {
                name: "appointments",
                title: "Appointment Notifications",
                description:
                  "Receive updates about new and upcoming appointments.",
              },
              {
                name: "billing",
                title: "Billing Notifications",
                description:
                  "Receive updates about payments and invoices.",
              },
              {
                name: "newPatients",
                title: "New Patient Notifications",
                description:
                  "Get notified when a new patient is registered.",
              },
              {
                name: "emailNotifications",
                title: "Email Notifications",
                description:
                  "Enable email notification preferences (demo only).",
              },
            ].map((item) => (
              <div className="settings-option" key={item.name}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>

                <label className="settings-switch">
                  <input
                    type="checkbox"
                    aria-label={item.title}
                    checked={notifications[item.name]}
                    onChange={() =>
                      handleNotificationChange(item.name)
                    }
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon security-icon">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h2>Security Settings</h2>
              <p>Manage your account password.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div className="settings-form-grid">
              <div className="settings-field">
                <label htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {securityMessage && (
              <p className="settings-message">{securityMessage}</p>
            )}

            <div className="settings-actions">
              <button type="submit" className="settings-save-btn">
                <LockKeyhole size={16} />
                Update Password
              </button>
            </div>
          </form>

          <div className="settings-demo-note">
            <ShieldCheck size={17} />
            <span>
              This is a frontend demo. Password changes are not connected
              to a real authentication system.
            </span>
          </div>
        </section>

        {/* Appearance */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon appearance-icon">
              <Palette size={21} />
            </div>
            <div>
              <h2>Appearance</h2>
              <p>Customize how your dashboard looks.</p>
            </div>
          </div>

          <div className="settings-option">
            <div>
              <strong>Dark Mode</strong>
              <p>Switch between light and dark appearance.</p>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                aria-label="Dark Mode"
                checked={preferences.theme === "dark"}
                onChange={(e) =>
                  handlePreferenceChange(
                    "theme",
                    e.target.checked ? "dark" : "light",
                  )
                }
              />
              <span className="settings-switch-slider" />
            </label>
          </div>
        </section>

        {/* System Preferences */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon preferences-icon">
              <SlidersHorizontal size={21} />
            </div>
            <div>
              <h2>System Preferences</h2>
              <p>Set your preferred date format and currency.</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field">
              <label htmlFor="dateFormat">Date Format</label>
              <select
                id="dateFormat"
                value={preferences.dateFormat}
                onChange={(e) =>
                  handlePreferenceChange("dateFormat", e.target.value)
                }
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="settings-field">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={preferences.currency}
                onChange={(e) =>
                  handlePreferenceChange("currency", e.target.value)
                }
              >
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>

          <div className="settings-preference-note">
            <CheckCircle2 size={16} />
            Your preferences are saved automatically in this browser.
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
