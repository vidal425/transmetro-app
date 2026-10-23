import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Ejemplo de coordenadas (deberías obtenerlas de Firestore)
const coordenadasRuta = [
  [14.631347, -90.516805], // Estación Plaza El Amate
  [14.56452, -90.56372],   // Estación Centra Sur
  // ... más coordenadas
];

function MapaTransmetro() {
  return (
    <MapContainer center={[14.63, -90.52]} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Dibuja la ruta */}
      <Polyline positions={coordenadasRuta} color="blue" />
      {/* Aquí podrías añadir un Marker para el bus en tiempo real */}
    </MapContainer>
  );
}