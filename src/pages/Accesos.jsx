import { useState, useEffect } from 'react';
import { escucharAccesos, crearAcceso, eliminarAcceso } from '../services/accesosService';
import { escucharEstaciones } from '../services/estacionesService';

export default function Accesos() {
  const [accesos, setAccesos] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [guardia, setGuardia] = useState('');
  const [estacionId, setEstacionId] = useState('');

  useEffect(() => {
    const u1 = escucharAccesos(setAccesos);
    const u2 = escucharEstaciones(setEstaciones);
    return () => { u1(); u2(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    if (estaciones.length === 0) {
      alert('⚠️ Primero debes crear al menos una Estación.\n\nVe a la sección 3️⃣ Estaciones.');
      return;
    }
    
    if (!guardia.trim()) {
      alert('⚠️ Requerimiento 10: Cada acceso debe tener al menos un guardia de seguridad asignado.');
      return;
    }

    await crearAcceso({
      descripcion,
      guardia_asignado: guardia,
      estacion_id: estacionId
    });
    setDescripcion(''); setGuardia(''); setEstacionId('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Accesos</h2>

      {estaciones.length === 0 && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          ⚠️ <strong>Falta:</strong> Registrar una <a href="/estaciones" style={{ color: '#856404', textDecoration: 'underline' }}>Estación</a>.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción del acceso" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="text" value={guardia} onChange={(e) => setGuardia(e.target.value)} placeholder="Nombre del guardia" style={{ padding: '8px', marginRight: '10px' }} />
        <select value={estacionId} onChange={(e) => setEstacionId(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="">Seleccionar estación</option>
          {estaciones.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#c0392b', color: 'white' }}>
          <tr><th>Descripción</th><th>Guardia</th><th>Estación</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {accesos.map(a => (
            <tr key={a.id}>
              <td>{a.descripcion}</td>
              <td>{a.guardia_asignado}</td>
              <td>{estaciones.find(e => e.id === a.estacion_id)?.nombre || 'Sin asignar'}</td>
              <td><button onClick={() => eliminarAcceso(a.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}