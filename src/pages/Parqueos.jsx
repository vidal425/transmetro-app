import { useState, useEffect } from 'react';
import { escucharParqueos, crearParqueo, eliminarParqueo } from '../services/parqueosService';
import { escucharEstaciones } from '../services/estacionesService';

export default function Parqueos() {
  const [parqueos, setParqueos] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [ubicacion, setUbicacion] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [estacionId, setEstacionId] = useState('');

  useEffect(() => {
    const u1 = escucharParqueos(setParqueos);
    const u2 = escucharEstaciones(setEstaciones);
    return () => { u1(); u2(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ubicacion.trim()) return;

    if (estaciones.length === 0) {
      alert('⚠️ Primero debes crear al menos una Estación.\n\nVe a la sección 3️⃣ Estaciones.');
      return;
    }

    await crearParqueo({
      ubicacion,
      capacidad: Number(capacidad) || 10,
      estacion_id: estacionId,
      bus_id: null
    });
    setUbicacion(''); setCapacidad(''); setEstacionId('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Parqueos</h2>

      {estaciones.length === 0 && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          ⚠️ <strong>Falta:</strong> Registrar una <a href="/estaciones" style={{ color: '#856404', textDecoration: 'underline' }}>Estación</a>.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ubicación" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="number" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} placeholder="Capacidad" style={{ padding: '8px', marginRight: '10px' }} />
        <select value={estacionId} onChange={(e) => setEstacionId(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="">Seleccionar estación</option>
          {estaciones.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#16a085', color: 'white' }}>
          <tr><th>Ubicación</th><th>Capacidad</th><th>Estación</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {parqueos.map(p => (
            <tr key={p.id}>
              <td>{p.ubicacion}</td>
              <td>{p.capacidad}</td>
              <td>{estaciones.find(e => e.id === p.estacion_id)?.nombre || 'Sin asignar'}</td>
              <td><button onClick={() => eliminarParqueo(p.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}