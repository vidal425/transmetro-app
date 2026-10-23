// src/components/MapaEstaciones.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Icono personalizado para el mapa
const busIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [25, 25]
});

export default function MapaEstaciones({ estaciones }) {
  return (
    <MapContainer center={[14.63, -90.52]} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {estaciones.map(est => (
        <Marker key={est.id} position={[est.latitud, est.longitud]} icon={busIcon}>
          <Popup>
            <strong>{est.nombre}</strong><br />
            Capacidad: {est.capacidad_maxima}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}