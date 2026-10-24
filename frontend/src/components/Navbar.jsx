export default function Navbar() {
  return (
    <div
      style={{
        background: "white",
        padding: "18px 30px",
        borderRadius: "12px",
        marginBottom: "25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: "#111827",
          }}
        >
          ForestGuard AI
        </h2>

        <p
          style={{
            margin: 0,
            color: "#6b7280",
          }}
        >
          Real-Time Forest Fire Monitoring & Risk Prediction
        </p>
      </div>

      <div
        style={{
          background: "#ef4444",
          color: "white",
          padding: "10px 18px",
          borderRadius: "20px",
          fontWeight: "bold",
        }}
      >
        HIGH RISK
      </div>
    </div>
  );
}