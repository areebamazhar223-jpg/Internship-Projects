import { TrendingUp, TrendingDown } from "lucide-react";

import "./StatCard.css";

function StatCard({
  title,
  value,
  change,
  trend = "up",
  icon: Icon,
  iconColor = "green",
  description = "Compared to last month",
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div>
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
        </div>

        <div className={`stat-card-icon ${iconColor}`}>
          {Icon && <Icon size={23} />}
        </div>
      </div>

      <div className="stat-card-bottom">
        <div className={`stat-card-change ${trend}`}>
          {trend === "up" ? (
            <TrendingUp size={15} />
          ) : (
            <TrendingDown size={15} />
          )}

          <span>{change}</span>
        </div>

        <span className="stat-card-description">{description}</span>
      </div>
    </div>
  );
}

export default StatCard;
