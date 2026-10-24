import { useEffect, useState } from "react";
import API from "../api/api";

export default function EarlyWarning() {
  const [risk, setRisk] = useState({
    tomorrow_risk: "LOW",
  });

  useEffect(() => {
    API.get("/api/weather")
      .then((res) => setRisk(res.data))
      .catch(console.error);
  }, []);

  let bg = "#22c55e";
  let title = "LOW RISK";
  let message = "Continue routine monitoring.";

  if (risk.tomorrow_risk === "MEDIUM") {
    bg = "#f59e0b";
    title = "EARLY WARNING";
    message =
      "Temperature and wind are expected to increase tomorrow. Increase surveillance.";
  }

  if (risk.tomorrow_risk === "HIGH") {
    bg = "#ef4444";
    title = "CRITICAL ALERT";
    message =
      "High wildfire risk predicted. Deploy response teams and notify nearby forest officials.";
  }

  return (
    <div
      style={{
        background: bg,
        color: "white",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2>{title}</h2>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {message}
      </p>
    </div>
  );
}