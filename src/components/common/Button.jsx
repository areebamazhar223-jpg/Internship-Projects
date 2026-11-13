import { LoaderCircle } from "lucide-react";
import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`custom-btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <LoaderCircle className="btn-loader" size={18} />
      ) : (
        Icon && <Icon size={18} />
      )}

      <span>{loading ? "Please wait..." : children}</span>
    </button>
  );
}

export default Button;
