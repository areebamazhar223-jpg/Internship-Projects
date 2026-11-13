
import { Download } from "lucide-react";
import "./ExportButton.css";

function ExportButton({
  onClick,
  label = "Export",
  disabled = false,
}) {
  return (
    <button
      type="button"
      className="export-button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <Download size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default ExportButton;
