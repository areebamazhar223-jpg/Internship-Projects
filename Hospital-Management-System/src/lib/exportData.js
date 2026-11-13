
// Convert values safely for CSV
const formatCSVValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

// Reusable CSV Export
export const exportToCSV = (
  data,
  filename = "hospital-data",
  columns = null
) => {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const keys = columns
    ? columns.map((column) =>
        typeof column === "string" ? column : column.dataKey
      )
    : Object.keys(data[0]);

  const headers = columns
    ? columns.map((column) =>
        typeof column === "string" ? column : column.header
      )
    : keys;

  const csvRows = [
    headers.map(formatCSVValue).join(","),
    ...data.map((item) =>
      keys.map((key) => formatCSVValue(item[key])).join(",")
    ),
  ];

  const csvContent = "\uFEFF" + csvRows.join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Reusable PDF Export - Libraries load only when needed
export const exportToPDF = async (
  data,
  filename = "hospital-report",
  title = "Hospital Management Report",
  columns = null
) => {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Dynamically import PDF libraries
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const autoTable = autoTableModule.default;

  const keys = columns
    ? columns.map((column) =>
        typeof column === "string" ? column : column.dataKey
      )
    : Object.keys(data[0]);

  const headers = columns
    ? columns.map((column) =>
        typeof column === "string" ? column : column.header
      )
    : keys;

  const rows = data.map((item) =>
    keys.map((key) => {
      const value = item[key];

      if (value === null || value === undefined) {
        return "-";
      }

      if (typeof value === "object") {
        return JSON.stringify(value);
      }

      return String(value);
    })
  );

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Report heading
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 18);

  // Export date
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    14,
    25
  );

  // Table
  autoTable(doc, {
    startY: 32,
    head: [headers],
    body: rows,
    theme: "grid",

    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [5, 73, 57],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [245, 249, 247],
    },

    margin: {
      top: 32,
      right: 14,
      bottom: 18,
      left: 14,
    },

    didDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages();

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 14,
        doc.internal.pageSize.getHeight() - 8,
        { align: "right" }
      );
    },
  });

  doc.save(`${filename}.pdf`);
};
