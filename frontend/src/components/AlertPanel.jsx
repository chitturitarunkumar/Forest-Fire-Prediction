import { useEffect, useState } from "react";
import API from "../api/api";

export default function AlertPanel() {
  const [risk, setRisk] = useState({
    // Weather API
    risk_level: "...",
    risk_score: 0,
    temperature: 0,
    humidity: 0,
    wind: 0,

    tomorrow_risk: "...",
    tomorrow_score: 0,
    tomorrow_temperature: 0,
    tomorrow_humidity: 0,
    tomorrow_wind: 0,

    // ML API
    risk: "...",
    brightness: 0,
    surface_temperature: 0,
    frp: 0,
  });

  useEffect(() => {
  Promise.all([
    API.get("/api/weather"),
    API.get("/api/ml_prediction"),
  ])
    .then(([weatherRes, mlRes]) => {
      setRisk({
        ...weatherRes.data,
        ...mlRes.data,
      });
    })
    .catch(console.error);
}, []);

  const todayColor =
    risk.risk_level === "HIGH"
      ? "#ef4444"
      : risk.risk_level === "MEDIUM"
      ? "#f59e0b"
      : "#22c55e";

  const tomorrowColor =
    risk.tomorrow_risk === "HIGH"
      ? "#ef4444"
      : risk.tomorrow_risk === "MEDIUM"
      ? "#f59e0b"
      : "#22c55e";

  const mlColor =
    risk.risk === "High"
      ? "#ef4444"
      : risk.risk === "Medium"
      ? "#f59e0b"
      : "#22c55e";

  return (
    <div
      style={{
        background: "#1f2937",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        AI Fire Risk Prediction
      </h2>

      <hr />

      <h3 style={{ textAlign: "center" }}>
        TODAY
      </h3>

      <h1
        style={{
          color: todayColor,
          textAlign: "center",
          fontSize: "42px",
        }}
      >
        {risk.risk_level}
      </h1>

      <h3 style={{ textAlign: "center" }}>
        Risk Score: {risk.risk_score}/100
      </h3>

      <p><b>Temperature:</b> {risk.temperature}°C</p>
      <p><b>Humidity:</b> {risk.humidity}%</p>
      <p><b>Wind:</b> {risk.wind} km/h</p>

      <hr />

      <h3 style={{ textAlign: "center" }}>
        TOMORROW FORECAST
      </h3>

      <h1
        style={{
          color: tomorrowColor,
          textAlign: "center",
          fontSize: "42px",
        }}
      >
        {risk.tomorrow_risk}
      </h1>

      <h3 style={{ textAlign: "center" }}>
        Risk Score: {risk.tomorrow_score}/100
      </h3>

      <p><b>Temperature:</b> {risk.tomorrow_temperature}°C</p>
      <p><b>Humidity:</b> {risk.tomorrow_humidity}%</p>
      <p><b>Wind:</b> {risk.tomorrow_wind} km/h</p>

      <hr />

      <h2 style={{ textAlign: "center" }}>
        AI Satellite Prediction
      </h2>

      <h1
        style={{
          color: mlColor,
          textAlign: "center",
          fontSize: "40px",
        }}
      >
        {risk.risk}
      </h1>

      <h3 style={{ textAlign: "center" }}>
        Random Forest Model
      </h3>

      <p>
        <b>Brightness:</b> {risk.brightness}
      </p>

      <p>
        <b>Surface Temperature:</b> {risk.surface_temperature} K
      </p>

      <p>
        <b>Fire Radiative Power:</b> {risk.frp} MW
      </p>

      <hr />

      <h3>Why Tomorrow?</h3>

      <p>
        Weather conditions are expected to worsen tomorrow due to increasing
        temperature and stronger winds.
      </p>

      <h3>Recommendation</h3>

      <p>
        Increase forest surveillance and keep firefighting teams on alert.
      </p>
    </div>
  );
}