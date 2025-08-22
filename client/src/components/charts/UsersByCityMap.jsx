import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function UsersByCityMap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/map/users-by-city")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .catch((err) => console.error("Map API error:", err));
  }, []);

 
  const maxUsers = data.length > 0 ? Math.max(...data.map((d) => d.user_count)) : 1;

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[35.1856, 33.3823]} 
        zoom={9}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((city, i) => (
          <CircleMarker
            key={i}
            center={[city.lat, city.lng]}
            radius={(city.user_count / maxUsers) * 50} 
            color="blue"
            fillColor="blue"
            fillOpacity={0.5}
          >
            <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent>
              <strong>{city.city}</strong> <br />
              Users: {city.user_count}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
