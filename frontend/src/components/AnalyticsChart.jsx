import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import API from "../api/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function AnalyticsChart() {
  const [counts, setCounts] = useState({
    high: 0,
    medium: 0,
    low: 0,
  });

  useEffect(() => {
    API.get("/api/hotspots")
      .then((res) => {
        let high = 0;
        let medium = 0;
        let low = 0;

        res.data.forEach((fire) => {
          if (fire.risk === "High") high++;
          else if (fire.risk === "Medium") medium++;
          else low++;
        });

        setCounts({ high, medium, low });
      })
      .catch(console.error);
  }, []);

  const data = {
    labels: ["High Risk", "Medium Risk", "Low Risk"],
    datasets: [
      {
        label: "Fire Hotspots",
        data: [counts.high, counts.medium, counts.low],
        backgroundColor: [
          "#ef4444",
          "#f59e0b",
          "#22c55e",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#ffffff",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },

      y: {
        beginAtZero: true,
        grid: {
          color: "#374151",
        },
        ticks: {
          color: "#ffffff",
          stepSize: 10,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "260px",
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
}