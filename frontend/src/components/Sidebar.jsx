export default function Sidebar() {
  const menuItems = [
    "Dashboard",
    "Fire Risk Map",
    "Weather",
    "Alerts",
    "Analytics",
    "Reports",
  ];

  return (
    <div
      style={{
        width: "250px",
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "25px",
      }}
    >
      <h2 style={{ color: "#22c55e", marginBottom: "40px" }}>
        ForestGuard AI
      </h2>

      {menuItems.map((item) => (
        <div
          key={item}
          style={{
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
            background: "#1f2937",
            cursor: "pointer",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}