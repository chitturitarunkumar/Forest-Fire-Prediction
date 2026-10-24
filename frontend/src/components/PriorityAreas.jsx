import { useEffect, useState } from "react";
import API from "../api/api";

export default function PriorityAreas() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    API.get("/api/hotspots")
      .then((res) => {
        const data = res.data;

        const grouped = {};

        data.forEach((fire) => {
          const state =
            fire.state ||
            `Lat ${fire.lat.toFixed(1)}, Lng ${fire.lng.toFixed(1)}`;

          if (!grouped[state]) {
            grouped[state] = {
              high: 0,
              medium: 0,
              low: 0,
            };
          }

          if (fire.risk === "High") grouped[state].high++;
          else if (fire.risk === "Medium") grouped[state].medium++;
          else grouped[state].low++;
        });

        const result = Object.entries(grouped)
          .map(([name, value]) => ({
            name,
            score:
              value.high * 3 +
              value.medium * 2 +
              value.low,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        setAreas(result);
      })
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        background: "#1f2937",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
      }}
    >
      <h2>🔥 Priority Areas</h2>

      {areas.map((area, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid #374151",
          }}
        >
          <span>{index + 1}. {area.name}</span>
          <b>{area.score}</b>
        </div>
      ))}
    </div>
  );
}