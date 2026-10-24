import { Fragment, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import API from "../api/api";

export default function MapView() {
  const [hotspots, setHotspots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/api/hotspots")
      .then((res) => {
        setHotspots(Array.isArray(res.data) ? res.data : []);
        setError("");
      })
      .catch((err) => {
        console.error("Unable to load fire hotspots:", err);
        setError("Could not load fire detections. Check that the backend is running.");
      });
  }, []);

  return (
    <div>
      {error && (
        <div style={{ color: "#fecaca", padding: "10px 0" }}>{error}</div>
      )}
      <div style={{ color: "#cbd5e1", marginBottom: 10, fontSize: 13 }}>
        Showing observed fire detections from the CSV dataset. Marker colors indicate
        brightness-based risk, not a prediction of future fire spread.
      </div>
      <MapContainer
        center={[22.5, 80]}
        zoom={5}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hotspots.map((fire, index) => (
          <Fragment key={`${fire.lat}-${fire.lng}-${index}`}>
            <CircleMarker
              center={[fire.lat, fire.lng]}
              radius={7}
              pathOptions={{
                color:
                  fire.risk === "High"
                    ? "#ff0000"
                    : fire.risk === "Medium"
                    ? "#ff9800"
                    : "#22c55e",
                fillColor:
                  fire.risk === "High"
                    ? "#ff0000"
                    : fire.risk === "Medium"
                    ? "#ff9800"
                    : "#22c55e",
                weight: 2,
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <b>{fire.name}</b>
                <br />
                <b>Risk:</b> {fire.risk}
                <br />
                <b>Brightness:</b> {fire.brightness}
                <br />
                <b>Latitude:</b> {fire.lat}
                <br />
                <b>Longitude:</b> {fire.lng}
                {fire.state && (
                  <>
                    <br />
                    <b>Approximate state:</b> {fire.state}
                  </>
                )}
                {fire.acq_date && (
                  <>
                    <br />
                    <b>Acquisition date:</b> {fire.acq_date}
                  </>
                )}
                {fire.frp !== undefined && (
                  <>
                    <br />
                    <b>FRP:</b> {fire.frp}
                  </>
                )}
              </Popup>
            </CircleMarker>
          </Fragment>
        ))}
      </MapContainer>
      <div style={{ color: "#cbd5e1", marginTop: 8, fontSize: 13 }}>
        Loaded detections: {hotspots.length}
      </div>
    </div>
  );
}
