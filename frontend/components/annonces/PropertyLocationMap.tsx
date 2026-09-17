'use client';

import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Les images par défaut de Leaflet ne se résolvent pas correctement avec le bundler de Next.js —
// on pointe explicitement vers les assets hébergés sur le CDN unpkg plutôt que de les importer localement.
const institutionIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface PropertyLocationMapProps {
  institutionName: string;
  institutionLat: number;
  institutionLng: number;
  distanceKm: number;
}

// IMPORTANT : on ne place jamais de marqueur sur l'annonce elle-même. On affiche l'établissement
// (position publique et connue) puis un cercle de rayon = distance déclarée, représentant la zone
// probable du logement — jamais son adresse exacte (cf. section 9 du cahier des charges).
export function PropertyLocationMap({
  institutionName,
  institutionLat,
  institutionLng,
  distanceKm,
}: PropertyLocationMapProps) {
  const center: [number, number] = [institutionLat, institutionLng];
  const radiusMeters = Math.max(distanceKm, 0.3) * 1000;

  return (
    <div className="overflow-hidden rounded-card shadow-soft">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '260px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={institutionIcon}>
          <Popup>{institutionName}</Popup>
        </Marker>
        <Circle
          center={center}
          radius={radiusMeters}
          pathOptions={{ color: '#E4785F', fillColor: '#E4785F', fillOpacity: 0.15, weight: 2 }}
        />
      </MapContainer>
      <p className="bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
        Zone approximative — le logement se trouve à environ {distanceKm} km de {institutionName}.
        L&apos;adresse exacte est communiquée par le propriétaire après contact.
      </p>
    </div>
  );
}
