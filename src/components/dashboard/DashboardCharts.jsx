
import { useMemo, useState } from "react";

import "./DashboardCharts.css";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

function getDateString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getWeekData(appointments, weekOffset = 0) {
  const today = new Date();

  const currentDay = today.getDay();
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);

  monday.setDate(monday.getDate() + weekOffset * 7);

  const appointmentCounts = new Map();

  appointments.forEach((appointment) => {
    if (appointment.status === "Cancelled") return;

    const date = appointment.date;

    appointmentCounts.set(
      date,
      (appointmentCounts.get(date) || 0) + 1
    );
  });

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + index);

    const dateString = getDateString(currentDate);

    return {
      day: currentDate.toLocaleDateString("en", {
        weekday: "short",
      }),
      appointments: appointmentCounts.get(dateString) || 0,
    };
  });
}

function getMonthlyPatientData(patients, selectedYear) {
  const monthlyCounts = Array(12).fill(0);

  patients.forEach((patient) => {
    if (!patient.date) return;

    const registrationDate = new Date(
      `${patient.date}T00:00:00`
    );

    if (Number.isNaN(registrationDate.getTime())) return;

    if (registrationDate.getFullYear() === selectedYear) {
      monthlyCounts[registrationDate.getMonth()]++;
    }
  });

  return MONTHS.map((month, index) => ({
    month,
    patients: monthlyCounts[index],
  }));
}

function getYAxisTicks(maxValue, marginTop, plotHeight) {
  const tickCount = Math.min(maxValue, 4) + 1;

  return Array.from({ length: tickCount }, (_, index) => {
    const value = Math.round(
      (maxValue / (tickCount - 1)) * index
    );
    const y =
      marginTop +
      plotHeight -
      (value / Math.max(maxValue, 1)) * plotHeight;

    return { value, y };
  }).reverse();
}

function SimpleBarChart({ data, color, maxValue }) {
  const width = 520;
  const height = 230;
  const margin = { top: 18, right: 18, bottom: 40, left: 42 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const barWidth = Math.min(30, plotWidth / Math.max(data.length, 1) * 0.56);
  const stepX = plotWidth / Math.max(data.length, 1);

  const yTicks = getYAxisTicks(maxValue, margin.top, plotHeight);

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Appointments overview chart"
    >
      {yTicks.map(({ value, y }) => (
        <g key={value}>
          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={y}
            y2={y}
            stroke="#edf1ee"
            strokeDasharray="3 3"
          />
          <text
            x={8}
            y={y + 4}
            fill="#5f6b64"
            fontSize="10"
            fontFamily="inherit"
          >
            {value}
          </text>
        </g>
      ))}

      {data.map((entry, index) => {
        const dayValue = Number(entry.appointments || 0);
        const x =
          margin.left + index * stepX + stepX / 2 - barWidth / 2;
        const barHeight =
          (dayValue / Math.max(maxValue, 1)) * plotHeight;
        const y = margin.top + plotHeight - barHeight;

        return (
          <g key={`${entry.day}-${index}`}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={6}
              fill={color}
            >
              <title>
                {entry.day}: {dayValue} appointments
              </title>
            </rect>
            <text
              x={margin.left + index * stepX + stepX / 2}
              y={height - 12}
              fill="#5f6b64"
              fontSize="11"
              fontFamily="inherit"
              textAnchor="middle"
            >
              {entry.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SimpleLineChart({ data, color, maxValue }) {
  const width = 520;
  const height = 230;
  const margin = { top: 18, right: 18, bottom: 42, left: 42 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const stepX = plotWidth / Math.max(data.length - 1, 1);

  const points = data
    .map((entry, index) => {
      const value = Number(entry.patients || 0);
      const x = margin.left + index * stepX;
      const y =
        margin.top +
        plotHeight -
        (value / Math.max(maxValue, 1)) * plotHeight;

      return { x, y, value, label: entry.month };
    })
    .filter((point) => Number.isFinite(point.x));

  const linePath = points
    .map((point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `L ${point.x} ${point.y}`
    )
    .join(" ");

  const yTicks = getYAxisTicks(maxValue, margin.top, plotHeight);

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Patient statistics chart"
    >
      {yTicks.map(({ value, y }) => (
        <g key={value}>
          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={y}
            y2={y}
            stroke="#edf1ee"
            strokeDasharray="3 3"
          />
          <text
            x={8}
            y={y + 4}
            fill="#5f6b64"
            fontSize="10"
            fontFamily="inherit"
          >
            {value}
          </text>
        </g>
      ))}

      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((point, index) => (
        <g key={`${point.label}-${index}`}>
          <circle
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
            stroke="#fff"
            strokeWidth="2"
          >
            <title>
              {point.label}: {point.value} new patients
            </title>
          </circle>
          <text
            x={point.x}
            y={height - 12}
            fill="#5f6b64"
            fontSize="11"
            fontFamily="inherit"
            textAnchor="middle"
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DashboardCharts({
  patients = [],
  appointments = [],
}) {
  const currentYear = new Date().getFullYear();
  const [weekFilter, setWeekFilter] = useState("current");
  const [selectedYear, setSelectedYear] = useState(
    String(currentYear)
  );

  const appointmentData = useMemo(
    () =>
      getWeekData(
        appointments,
        weekFilter === "previous" ? -1 : 0
      ),
    [appointments, weekFilter]
  );

  const patientData = useMemo(
    () =>
      getMonthlyPatientData(
        patients,
        Number(selectedYear)
      ),
    [patients, selectedYear]
  );

  const appointmentMax = useMemo(
    () =>
      Math.max(1, ...appointmentData.map(({ appointments }) => appointments)),
    [appointmentData]
  );

  const patientMax = useMemo(
    () =>
      Math.max(1, ...patientData.map(({ patients }) => patients)),
    [patientData]
  );

  return (
    <div className="dashboard-charts">
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2>Appointments Overview</h2>
            <p>Weekly appointment activity</p>
          </div>

          <select
            className="chart-filter"
            value={weekFilter}
            onChange={(event) => setWeekFilter(event.target.value)}
            aria-label="Appointments chart period"
          >
            <option value="current">This Week</option>
            <option value="previous">Last Week</option>
          </select>
        </div>

        <div className="chart-container">
          <SimpleBarChart
            data={appointmentData}
            color="#075b46"
            maxValue={appointmentMax}
          />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2>Patient Statistics</h2>
            <p>Monthly patient registrations</p>
          </div>

          <select
            className="chart-filter"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            aria-label="Patient statistics year"
          >
            <option value={String(currentYear)}>{currentYear}</option>
            <option value={String(currentYear - 1)}>{currentYear - 1}</option>
          </select>
        </div>

        <div className="chart-container">
          <SimpleLineChart
            data={patientData}
            color="#ff8b5e"
            maxValue={patientMax}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
