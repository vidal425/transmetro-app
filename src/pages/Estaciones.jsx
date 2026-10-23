import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { escucharEstaciones, crearEstacion, eliminarEstacion } from '../services/estacionesService';
import { escucharLineas } from '../services/lineasService';
import { escucharMunicipalidades } from '../services/municipalidadesService';

export default function Estaciones() {
  const [estaciones, setEstaciones] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [nombre, setNombre] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [lineasSeleccionadas, setLineasSeleccionadas] = useState([]);
  const [municipalidadId, setMunicipalidadId] = useState('');
  const [orden, setOrden] = useState('');

  useEffect(() => {
    const u1 = escucharEstaciones(setEstaciones);
    const u2 = escucharLineas(setLineas);
    const u3 = escucharMunicipalidades(setMunicipalidades);
    return () => { u1(); u2(); u3(); };
  }, []);

  const toggleLinea = (id) => {
    setLineasSeleccionadas(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (municipalidades.length === 0 || lineas.length === 0) {
      alert('⚠️ Faltan Municipalidades o Líneas creadas.');
      return;
    }
    if (lineasSeleccionadas.length === 0) {
      alert('⚠️ Debes seleccionar al menos una línea.');
      return;
    }
    await crearEstacion({ nombre, capacidad_maxima: Number(capacidad) || 100, ocupacion_actual: 0, lineas_ids: lineasSeleccionadas, municipalidad_id: municipalidadId, orden: Number(orden) || 0 });
    setNombre(''); setCapacidad(''); setLineasSeleccionadas([]); setMunicipalidadId(''); setOrden('');
  };

  const selectStyle = (valor) => ({
    padding: '8px', marginRight: '10px',
    backgroundColor: valor ? '#d4edda' : 'white',
    border: valor ? '2px solid #27ae60' : '1px solid #ccc',
    borderRadius: '4px'
  });

  return (
    <PageLayout title="Gestión de Estaciones">
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre estación" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="number" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} placeholder="Capacidad" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="number" value={orden} onChange={(e) => setOrden(e.target.value)} placeholder="Orden" style={{ padding: '8px', marginRight: '10px' }} />
        
        <select value={municipalidadId} onChange={(e) => setMunicipalidadId(e.target.value)} style={selectStyle(municipalidadId)}>
          <option value="">Municipalidad</option>
          {municipalidades.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>

        <div style={{ margin: '10px 0' }}>
          <strong>Líneas a las que pertenece:</strong>
          {lineas.map(l => (
            <label key={l.id} style={{ marginLeft: '10px' }}>
              <input type="checkbox" checked={lineasSeleccionadas.includes(l.id)} onChange={() => toggleLinea(l.id)} /> {l.nombre}
            </label>
          ))}
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#27ae60', color: 'white' }}>
          <tr><th>Nombre</th><th>Capacidad</th><th>Orden</th><th>Líneas</th><th>Municipalidad</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {estaciones.map(est => (
            <tr key={est.id}>
              <td>{est.nombre}</td>
              <td>{est.capacidad_maxima}</td>
              <td>{est.orden}</td>
              <td>{(est.lineas_ids || []).map(id => lineas.find(l => l.id === id)?.nombre).join(', ') || '-'}</td>
              <td>{municipalidades.find(m => m.id === est.municipalidad_id)?.nombre || '-'}</td>
              <td><button onClick={() => eliminarEstacion(est.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}