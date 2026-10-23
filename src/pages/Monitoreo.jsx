import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import PageLayout from '../components/PageLayout';
import { db } from '../firebase/config';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Arreglo con las coordenadas de la ruta (puedes cambiarlas)
const rutaCoordenadas = [
  [14.56452, -90.56372],  // Centra Sur
  [14.62599, -90.55858],  // Roosevelt
  [14.630193, -90.515574], // El Calvario
  [14.631347, -90.516805]  // Plaza El Amate
];

// Icono del bus personalizado
const busIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [35, 35]
});

export default function Monitoreo() {
  const [posicionBus, setPosicionBus] = useState(rutaCoordenadas[0]);
  const [simulando, setSimulando] = useState(false);

  // 1. ESCUCHAR LOS DATOS EN TIEMPO REAL DESDE FIRESTORE
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'monitoreo', 'bus_1'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPosicionBus([data.lat, data.lng]);
      }
    });
    return () => unsub();
  }, []);

  // 2. FUNCIÓN PARA SIMULAR EL MOVIMIENTO DEL GPS
  const iniciarSimulacion = async () => {
    if (simulando) return;
    setSimulando(true);

    for (let i = 0; i < rutaCoordenadas.length; i++) {
      // Guardamos la nueva posición en Firestore
      await setDoc(doc(db, 'monitoreo', 'bus_1'), {
        lat: rutaCoordenadas[i][0],
        lng: rutaCoordenadas[i][1],
        placa: 'ABC-123',
        timestamp: new Date().toISOString()
      });

      // Esperamos 4 segundos antes de moverlo a la siguiente estación
      await new Promise(resolve => setTimeout(resolve, 4000));
    }

    setSimulando(false);
    alert('🚌 El bus ha completado la ruta simulada.');
  };

  return (
    <PageLayout title="Monitoreo en Tiempo Real (Demo GPS)">
      <div style={{ marginBottom: '20px', background: '#e8f4f8', padding: '15px', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Estado:</strong> {simulando ? '🟢 Simulación activa (Moviendo bus...)' : '🔴 En espera'}
        </p>
        <button 
          onClick={iniciarSimulacion} 
          disabled={simulando}
          style={{ 
            background: simulando ? '#95a5a6' : '#27ae60', 
            color: 'white', padding: '10px 20px', 
            border: 'none', borderRadius: '5px', 
            cursor: simulando ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          ▶ Iniciar Simulación de GPS
        </button>
      </div>

      <div style={{ border: '2px solid #bdc3c7', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer center={[14.60, -90.53]} zoom={13} style={{ height: '500px', width: '100%' }}>
          {/* Mapa base de OpenStreetMap */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Dibujar la ruta azul */}
          <Polyline positions={rutaCoordenadas} color="#3498db" weight={5} opacity={0.7} />

          {/* Marcador de las estaciones */}
          {rutaCoordenadas.map((coord, index) => (
            <Marker key={index} position={coord}>
              <Popup>Estación {index + 1}</Popup>
            </Marker>
          ))}

          {/* Marcador del bus (se mueve en tiempo real) */}
          <Marker position={posicionBus} icon={busIcon}>
            <Popup>
              <strong>Bus ABC-123</strong><br />
              En ruta
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </PageLayout>
  );
}