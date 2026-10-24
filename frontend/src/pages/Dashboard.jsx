import PriorityAreas from "../components/PriorityAreas";
import EarlyWarning from "../components/EarlyWarning";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import AnalyticsChart from "../components/AnalyticsChart";
import AlertPanel from "../components/AlertPanel";
import API from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    active_fires: 0,
    high_risk_zones: 0,
    weather_stations: 0,
    alerts_sent: 0,
  });

  useEffect(() => {
    API.get("/api/dashboard")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  const cards = [
    {
      title: "Active Fires",
      value: stats.active_fires,
      color: "#ef4444",
    },
    {
      title: "High Risk Zones",
      value: stats.high_risk_zones,
      color: "#f59e0b",
    },
    {
      title: "Weather Stations",
      value: stats.weather_stations,
      color: "#3b82f6",
    },
    {
      title: "Alerts Sent",
      value: stats.alerts_sent,
      color: "#22c55e",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        background: "#0f172a",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "25px",
        }}
      >
        <Navbar />

        {/* Dashboard Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              style={{
                background: card.color,
                borderRadius: "12px",
                padding: "20px",
                color: "white",
                textAlign: "center",
              }}
            >
              <h3>{card.title}</h3>
              <h1>{card.value}</h1>
            </div>
          ))}
        </div>

        {/* Map */}
        <div style={{ marginBottom: "25px" }}>
          <MapView />
        </div>

        {/* Bottom Panels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Analytics */}
          <div
            style={{
              background: "#1f2937",
              borderRadius: "12px",
              padding: "20px",
              color: "white",
            }}
          >
            <h2>Risk Analytics</h2>
            <AnalyticsChart />
          </div>

          {/* AI Prediction + Tomorrow Warning */}
           <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }}
>
  <AlertPanel />

  <EarlyWarning />

  <PriorityAreas />
</div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            color: "#9ca3af",
            marginTop: "30px",
            paddingBottom: "20px",
            fontSize: "14px",
          }}
        >
          Powered by NASA FIRMS Satellite Data • Open-Meteo API • FastAPI • React
        </div>
      </div>
    </div>
  );
}