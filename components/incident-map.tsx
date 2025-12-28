"use client"

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { Incident } from "@/lib/firestore"

const containerStyle = {
  width: "100%",
  height: "100%",
}

const defaultCenter = {
  lat: 26.9124, // Jaipur (safe default)
  lng: 75.7873,
}

export function IncidentMap({ incidents }: { incidents: Incident[] }) {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={8}
      >
        {incidents.map((i) => (
          <Marker
            key={i.id}
            position={{ lat: i.latitude, lng: i.longitude }}
            icon={
              i.type === "injured"
                ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/black-dot.png"
            }
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}
