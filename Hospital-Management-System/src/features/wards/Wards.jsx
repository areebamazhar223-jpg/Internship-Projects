
import { useEffect, useMemo, useState } from "react";
import {
  Bed,
  Building2,
  Plus,
  Search,
  Users,
  CheckCircle,
  Wrench,
  Trash2,
  UserPlus,
  LogOut,
  X,
} from "lucide-react";
import "./Wards.css";

const STORAGE_KEY = "hospitalWards";
const PATIENT_STORAGE_KEY = "hospitalPatients";

const initialWards = [
  {
    id: 1,
    name: "General Ward",
    type: "General",
    floor: "Ground Floor",
    beds: [
      { id: 101, number: "G-01", status: "Available", patientName: "", patientId: "" },
      { id: 102, number: "G-02", status: "Occupied", patientName: "Ali Ahmed", patientId: "" },
      { id: 103, number: "G-03", status: "Available", patientName: "", patientId: "" },
      { id: 104, number: "G-04", status: "Maintenance", patientName: "", patientId: "" },
    ],
  },
  {
    id: 2,
    name: "Private Ward",
    type: "Private",
    floor: "First Floor",
    beds: [
      { id: 201, number: "P-01", status: "Occupied", patientName: "Sara Khan", patientId: "" },
      { id: 202, number: "P-02", status: "Available", patientName: "", patientId: "" },
      { id: 203, number: "P-03", status: "Available", patientName: "", patientId: "" },
    ],
  },
  {
    id: 3,
    name: "ICU",
    type: "ICU",
    floor: "Second Floor",
    beds: [
      { id: 301, number: "ICU-01", status: "Occupied", patientName: "Usman Ali", patientId: "" },
      { id: 302, number: "ICU-02", status: "Maintenance", patientName: "", patientId: "" },
    ],
  },
];

function getInitialWards() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load wards:", error);
  }

  return initialWards;
}

function getInitialPatients() {
  try {
    const saved = localStorage.getItem(PATIENT_STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load patients:", error);
  }

  return [];
}

function Wards() {
  const [wards, setWards] = useState(getInitialWards);
  const [patients] = useState(getInitialPatients);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showWardForm, setShowWardForm] = useState(false);
  const [showBedForm, setShowBedForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);

  const [wardForm, setWardForm] = useState({
    name: "",
    type: "General",
    floor: "",
    bedCount: "4",
  });

  const [bedForm, setBedForm] = useState({
    wardId: "",
    number: "",
  });

  const [assignForm, setAssignForm] = useState({
    wardId: "",
    bedId: "",
    patientId: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wards));
    } catch (error) {
      console.error("Unable to save wards:", error);
    }
  }, [wards]);

  const activePatients = useMemo(
    () => patients.filter((patient) => patient.status === "Active"),
    [patients]
  );

  const assignedPatientIds = useMemo(() => {
    return wards.flatMap((ward) =>
      ward.beds
        .filter((bed) => bed.status === "Occupied" && bed.patientId)
        .map((bed) => String(bed.patientId))
    );
  }, [wards]);

  const availablePatients = activePatients.filter(
    (patient) =>
      !assignedPatientIds.includes(String(patient.patientId))
  );

  const allBeds = wards.flatMap((ward) =>
    ward.beds.map((bed) => ({
      ...bed,
      wardName: ward.name,
    }))
  );

  const totalBeds = allBeds.length;
  const occupiedBeds = allBeds.filter(
    (bed) => bed.status === "Occupied"
  ).length;
  const availableBeds = allBeds.filter(
    (bed) => bed.status === "Available"
  ).length;
  const maintenanceBeds = allBeds.filter(
    (bed) => bed.status === "Maintenance"
  ).length;

  const filteredWards = useMemo(() => {
    return wards
      .map((ward) => ({
        ...ward,
        beds: ward.beds.filter((bed) => {
          const term = searchTerm.toLowerCase();

          const matchesSearch =
            ward.name.toLowerCase().includes(term) ||
            bed.number.toLowerCase().includes(term) ||
            (bed.patientName || "").toLowerCase().includes(term) ||
            (bed.patientId || "").toLowerCase().includes(term);

          const matchesStatus =
            statusFilter === "All" || bed.status === statusFilter;

          return matchesSearch && matchesStatus;
        }),
      }))
      .filter((ward) => {
        if (!searchTerm && statusFilter === "All") return true;
        return ward.beds.length > 0;
      });
  }, [wards, searchTerm, statusFilter]);

  const addWard = (event) => {
    event.preventDefault();

    const bedCount = Math.max(
      1,
      Math.min(100, Number(wardForm.bedCount) || 1)
    );

    const prefix =
      wardForm.type === "ICU"
        ? "ICU"
        : wardForm.type.slice(0, 1).toUpperCase();

    const newWard = {
      id: Date.now(),
      name: wardForm.name.trim(),
      type: wardForm.type,
      floor: wardForm.floor.trim(),
      beds: Array.from({ length: bedCount }, (_, index) => ({
        id: Date.now() + index + 1,
        number: `${prefix}-${String(index + 1).padStart(2, "0")}`,
        status: "Available",
        patientName: "",
        patientId: "",
      })),
    };

    setWards((current) => [...current, newWard]);

    setWardForm({
      name: "",
      type: "General",
      floor: "",
      bedCount: "4",
    });

    setShowWardForm(false);
  };

  const deleteWard = (wardId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ward?"
    );

    if (!confirmed) return;

    setWards((current) =>
      current.filter((ward) => ward.id !== wardId)
    );
  };

  const openBedForm = (wardId) => {
    setBedForm({
      wardId: String(wardId),
      number: "",
    });

    setShowBedForm(true);
  };

  const addBed = (event) => {
    event.preventDefault();

    const number = bedForm.number.trim();
    if (!number) return;

    const ward = wards.find(
      (item) => String(item.id) === bedForm.wardId
    );

    if (!ward) return;

    if (
      ward.beds.some(
        (bed) =>
          bed.number.toLowerCase() === number.toLowerCase()
      )
    ) {
      alert("This bed number already exists in this ward.");
      return;
    }

    setWards((current) =>
      current.map((item) =>
        String(item.id) === bedForm.wardId
          ? {
              ...item,
              beds: [
                ...item.beds,
                {
                  id: Date.now(),
                  number,
                  status: "Available",
                  patientName: "",
                  patientId: "",
                },
              ],
            }
          : item
      )
    );

    setShowBedForm(false);
  };

  const openAssignForm = (wardId, bedId) => {
    setAssignForm({
      wardId: String(wardId),
      bedId: String(bedId),
      patientId: "",
    });

    setShowAssignForm(true);
  };

  const assignBed = (event) => {
    event.preventDefault();

    const patient = availablePatients.find(
      (item) =>
        String(item.patientId) === String(assignForm.patientId)
    );

    if (!patient) {
      alert("Please select an available active patient.");
      return;
    }

    setWards((current) =>
      current.map((ward) =>
        String(ward.id) === assignForm.wardId
          ? {
              ...ward,
              beds: ward.beds.map((bed) =>
                String(bed.id) === assignForm.bedId &&
                bed.status === "Available"
                  ? {
                      ...bed,
                      status: "Occupied",
                      patientName: patient.name,
                      patientId: patient.patientId,
                    }
                  : bed
              ),
            }
          : ward
      )
    );

    setShowAssignForm(false);
  };

  const releaseBed = (wardId, bedId) => {
    const confirmed = window.confirm("Release this bed?");
    if (!confirmed) return;

    setWards((current) =>
      current.map((ward) =>
        ward.id === wardId
          ? {
              ...ward,
              beds: ward.beds.map((bed) =>
                bed.id === bedId
                  ? {
                      ...bed,
                      status: "Available",
                      patientName: "",
                      patientId: "",
                    }
                  : bed
              ),
            }
          : ward
      )
    );
  };

  const toggleMaintenance = (wardId, bedId, currentStatus) => {
    const nextStatus =
      currentStatus === "Maintenance"
        ? "Available"
        : "Maintenance";

    setWards((current) =>
      current.map((ward) =>
        ward.id === wardId
          ? {
              ...ward,
              beds: ward.beds.map((bed) =>
                bed.id === bedId
                  ? {
                      ...bed,
                      status: nextStatus,
                      patientName: "",
                      patientId: "",
                    }
                  : bed
              ),
            }
          : ward
      )
    );
  };

  return (
    <div className="wards-page">
      <div className="wards-page-header">
        <div>
          <span className="wards-eyebrow">
            HOSPITAL MANAGEMENT
          </span>
          <h1>Ward & Bed Management</h1>
          <p>
            Manage hospital wards, bed availability and patient assignments.
          </p>
        </div>

        <button
          className="wards-primary-btn"
          onClick={() => setShowWardForm(true)}
        >
          <Plus size={18} /> Add New Ward
        </button>
      </div>

      <div className="wards-stats-grid">
        <div className="wards-stat-card">
          <div className="wards-stat-icon total">
            <Bed size={21} />
          </div>
          <div>
            <span>Total Beds</span>
            <strong>{totalBeds}</strong>
          </div>
        </div>

        <div className="wards-stat-card">
          <div className="wards-stat-icon available">
            <CheckCircle size={21} />
          </div>
          <div>
            <span>Available Beds</span>
            <strong>{availableBeds}</strong>
          </div>
        </div>

        <div className="wards-stat-card">
          <div className="wards-stat-icon occupied">
            <Users size={21} />
          </div>
          <div>
            <span>Occupied Beds</span>
            <strong>{occupiedBeds}</strong>
          </div>
        </div>

        <div className="wards-stat-card">
          <div className="wards-stat-icon maintenance">
            <Wrench size={21} />
          </div>
          <div>
            <span>Maintenance</span>
            <strong>{maintenanceBeds}</strong>
          </div>
        </div>
      </div>

      <div className="wards-toolbar">
        <div className="wards-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search ward, bed or patient..."
            aria-label="Search ward, bed or patient"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter beds by status"
        >
          <option value="All">All Bed Status</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      <div className="wards-section-heading">
        <div>
          <h2>Hospital Wards</h2>
          <p>{wards.length} wards registered</p>
        </div>
      </div>

      <div className="wards-list">
        {filteredWards.map((ward) => {
          const wardOccupied = ward.beds.filter(
            (bed) => bed.status === "Occupied"
          ).length;

          const wardAvailable = ward.beds.filter(
            (bed) => bed.status === "Available"
          ).length;

          return (
            <section className="ward-card" key={ward.id}>
              <div className="ward-card-header">
                <div className="ward-title-group">
                  <div className="ward-icon">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <h3>{ward.name}</h3>
                    <p>
                      {ward.type} Ward <span>•</span>{" "}
                      {ward.floor || "Floor not specified"}
                    </p>
                  </div>
                </div>

                <div className="ward-header-actions">
                  <span className="ward-bed-count">
                    {ward.beds.length} beds
                  </span>

                  <button
                    className="ward-delete-btn"
                    onClick={() => deleteWard(ward.id)}
                    title="Delete ward"
                    aria-label={`Delete ${ward.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <div className="ward-progress-area">
                <div className="ward-progress-labels">
                  <span>{wardOccupied} occupied</span>
                  <span>{wardAvailable} available</span>
                </div>

                <div className="ward-progress-track">
                  <div
                    className="ward-progress-fill"
                    style={{
                      width: `${
                        ward.beds.length
                          ? (wardOccupied / ward.beds.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="ward-beds-grid">
                {ward.beds.map((bed) => (
                  <div
                    className={`ward-bed-item status-${bed.status.toLowerCase()}`}
                    key={bed.id}
                  >
                    <div className="ward-bed-top">
                      <Bed size={19} />
                      <span
                        className={`ward-status-badge ${bed.status.toLowerCase()}`}
                      >
                        {bed.status}
                      </span>
                    </div>

                    <strong>{bed.number}</strong>

                    {bed.status === "Occupied" ? (
                      <div className="ward-patient-name">
                        <p>
                          <Users size={14} /> {bed.patientName}
                        </p>
                        {bed.patientId && (
                          <small>{bed.patientId}</small>
                        )}
                      </div>
                    ) : (
                      <p className="ward-bed-caption">
                        {bed.status === "Maintenance"
                          ? "Not in service"
                          : "Ready for patient"}
                      </p>
                    )}

                    <div className="ward-bed-actions">
                      {bed.status === "Available" && (
                        <button
                          onClick={() =>
                            openAssignForm(ward.id, bed.id)
                          }
                        >
                          <UserPlus size={14} /> Assign
                        </button>
                      )}

                      {bed.status === "Occupied" && (
                        <button
                          onClick={() =>
                            releaseBed(ward.id, bed.id)
                          }
                        >
                          <LogOut size={14} /> Release
                        </button>
                      )}

                      {bed.status !== "Occupied" && (
                        <button
                          className="ward-maintenance-action"
                          onClick={() =>
                            toggleMaintenance(
                              ward.id,
                              bed.id,
                              bed.status
                            )
                          }
                        >
                          <Wrench size={14} />
                          {bed.status === "Maintenance"
                            ? "Restore"
                            : "Maintenance"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="ward-add-bed-btn"
                onClick={() => openBedForm(ward.id)}
              >
                <Plus size={16} /> Add Bed to This Ward
              </button>
            </section>
          );
        })}

        {filteredWards.length === 0 && (
          <div className="wards-empty-state">
            <Bed size={35} />
            <h3>No wards or beds found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        )}
      </div>

      {showWardForm && (
        <div
          className="wards-modal-backdrop"
          onClick={() => setShowWardForm(false)}
        >
          <div
            className="wards-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-ward-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="wards-modal-header">
              <div>
                <h2 id="add-ward-modal-title">Add New Ward</h2>
                <p>Enter ward information below.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWardForm(false)}
                aria-label="Close Add New Ward dialog"
              >
                <X />
              </button>
            </div>

            <form onSubmit={addWard}>
              <label htmlFor="wardName">Ward Name</label>
              <input
                id="wardName"
                required
                value={wardForm.name}
                onChange={(event) =>
                  setWardForm({
                    ...wardForm,
                    name: event.target.value,
                  })
                }
                placeholder="e.g. Children's Ward"
              />

              <label htmlFor="wardType">Ward Type</label>
              <select
                id="wardType"
                value={wardForm.type}
                onChange={(event) =>
                  setWardForm({
                    ...wardForm,
                    type: event.target.value,
                  })
                }
              >
                <option>General</option>
                <option>Private</option>
                <option>ICU</option>
                <option>Emergency</option>
                <option>Maternity</option>
                <option>Pediatric</option>
              </select>

              <label htmlFor="wardFloor">Floor</label>
              <input
                id="wardFloor"
                value={wardForm.floor}
                onChange={(event) =>
                  setWardForm({
                    ...wardForm,
                    floor: event.target.value,
                  })
                }
                placeholder="e.g. First Floor"
              />

              <label htmlFor="wardBedCount">Number of Beds</label>
              <input
                id="wardBedCount"
                type="number"
                min="1"
                max="100"
                required
                value={wardForm.bedCount}
                onChange={(event) =>
                  setWardForm({
                    ...wardForm,
                    bedCount: event.target.value,
                  })
                }
              />

              <div className="wards-modal-actions">
                <button
                  type="button"
                  className="wards-cancel-btn"
                  onClick={() => setShowWardForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="wards-primary-btn">
                  <Plus size={17} /> Create Ward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBedForm && (
        <div
          className="wards-modal-backdrop"
          onClick={() => setShowBedForm(false)}
        >
          <div
            className="wards-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="wards-modal-header">
              <div>
                <h2>Add New Bed</h2>
                <p>Add a bed to the selected ward.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowBedForm(false)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <form onSubmit={addBed}>
              <label htmlFor="bedWardId">Select Ward</label>
              <select
                id="bedWardId"
                required
                value={bedForm.wardId}
                onChange={(event) =>
                  setBedForm({
                    ...bedForm,
                    wardId: event.target.value,
                  })
                }
              >
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>

              <label htmlFor="bedNumber">Bed Number</label>
              <input
                id="bedNumber"
                required
                value={bedForm.number}
                onChange={(event) =>
                  setBedForm({
                    ...bedForm,
                    number: event.target.value,
                  })
                }
                placeholder="e.g. G-05"
              />

              <div className="wards-modal-actions">
                <button
                  type="button"
                  className="wards-cancel-btn"
                  onClick={() => setShowBedForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="wards-primary-btn">
                  <Plus size={17} /> Add Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignForm && (
        <div
          className="wards-modal-backdrop"
          onClick={() => setShowAssignForm(false)}
        >
          <div
            className="wards-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="wards-modal-header">
              <div>
                <h2>Assign Bed</h2>
                <p>Select an active patient from your patient records.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignForm(false)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <form onSubmit={assignBed}>
              <label htmlFor="assignPatientId">Select Patient</label>

              <select
                id="assignPatientId"
                required
                autoFocus
                value={assignForm.patientId}
                onChange={(event) =>
                  setAssignForm({
                    ...assignForm,
                    patientId: event.target.value,
                  })
                }
              >
                <option value="">Choose a patient</option>

                {availablePatients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.patientId}
                  >
                    {patient.name} ({patient.patientId})
                  </option>
                ))}
              </select>

              {availablePatients.length === 0 && (
                <p className="wards-bed-caption">
                  No available active patients found. Add an active
                  patient in the Patients section first.
                </p>
              )}

              <div className="wards-modal-actions">
                <button
                  type="button"
                  className="wards-cancel-btn"
                  onClick={() => setShowAssignForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="wards-primary-btn"
                  disabled={availablePatients.length === 0}
                >
                  <UserPlus size={17} /> Assign Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wards;
