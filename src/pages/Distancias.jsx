import { useState, useEffect } from 'react';
import { escucharDistancias, crearDistancia, eliminarDistancia } from '../services/distanciasService';
import { escucharEstaciones } from '../services/estacionesService';

export default function Distancias() {
  const [distancias, setDistancias] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [km, setKm] = useState('');
  const [tiempo, setTiempo] = useState('');

  useEffect(() => {
    const u1 = escucharDistancias(setDistancias);
    const u2 = escucharEstaciones(setEstaciones);
    return () => { u1(); u2(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origen || !destino || !km) return;

    if (estaciones.length < 2) {
      alert('⚠️ Necesitas al menos 2 Estaciones registradas para crear una distancia.\n\nVe a la sección 3️⃣ Estaciones.');
      return;
    }

    if (origen === destino) {
      alert('⚠️ La estación de origen y destino no pueden ser la misma.');
      return;
    }

    await crearDistancia({
      estacion_origen_id: origen,
      estacion_destino_id: destino,
      distancia_km: Number(km),
      tiempo_estimado: Number(tiempo) || 0
    });
    setOrigen(''); setDestino(''); setKm(''); setTiempo('');
  };

  const nombreEstacion = (id) => estaciones.find(e => e.id === id)?.nombre || 'Desconocida';

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Distancias</h2>

      {estaciones.length < 2 && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          ⚠️ <strong>Falta:</strong> Necesitas al menos 2 <a href="/estaciones" style={{ color: '#856404', textDecoration: 'underline' }}>Estaciones</a> registradas.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <select value={origen} onChange={(e) => setOrigen(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="">Estación origen</option>
          {estaciones.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={destino} onChange={(e) => setDestino(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="">Estación destino</option>
          {estaciones.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <input type="number" step="0.1" value={km} onChange={(e) => setKm(e.target.value)} placeholder="Distancia (km)" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="number" value={tiempo} onChange={(e) => setTiempo(e.target.value)} placeholder="Tiempo (min)" style={{ padding: '8px', marginRight: '10px' }} />
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#8e44ad', color: 'white' }}>
          <tr><th>Origen</th><th>Destino</th><th>Distancia (km)</th><th>Tiempo (min)</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {distancias.map(d => (
            <tr key={d.id}>
              <td>{nombreEstacion(d.estacion_origen_id)}</td>
              <td>{nombreEstacion(d.estacion_destino_id)}</td>
              <td>{d.distancia_km}</td>
              <td>{d.tiempo_estimado}</td>
              <td><button onClick={() => eliminarDistancia(d.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}