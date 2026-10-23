import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { escucharLineas, crearLinea, eliminarLinea } from '../services/lineasService';
import { escucharMunicipalidades } from '../services/municipalidadesService';

export default function Lineas() {
  const [lineas, setLineas] = useState([]);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [nombre, setNombre] = useState('');
  const [distancia, setDistancia] = useState('');
  const [municipalidadId, setMunicipalidadId] = useState('');

  useEffect(() => {
    const u1 = escucharLineas(setLineas);
    const u2 = escucharMunicipalidades(setMunicipalidades);
    return () => { u1(); u2(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (municipalidades.length === 0) {
      alert('⚠️ Primero debes crear al menos una Municipalidad.');
      return;
    }
    await crearLinea({ nombre, distancia_total: Number(distancia) || 0, municipalidad_id: municipalidadId });
    setNombre(''); setDistancia(''); setMunicipalidadId('');
  };

  // ESTILO PARA EL SELECT (Se pinta de verde si hay valor)
  const selectStyle = (valor) => ({
    padding: '8px', marginRight: '10px',
    backgroundColor: valor ? '#d4edda' : 'white',
    border: valor ? '2px solid #27ae60' : '1px solid #ccc',
    borderRadius: '4px'
  });

  return (
    <PageLayout title="Gestión de Líneas">
      {municipalidades.length === 0 && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          ⚠️ <strong>Antes de crear:</strong> Debes registrar una <a href="/municipalidades" style={{ color: '#856404' }}>Municipalidad</a>.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de la línea" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="number" step="0.1" value={distancia} onChange={(e) => setDistancia(e.target.value)} placeholder="Distancia total (km)" style={{ padding: '8px', marginRight: '10px' }} />
        
        <select value={municipalidadId} onChange={(e) => setMunicipalidadId(e.target.value)} style={selectStyle(municipalidadId)}>
          <option value="">Seleccionar municipalidad</option>
          {municipalidades.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#2c3e50', color: 'white' }}>
          <tr><th>Nombre</th><th>Distancia (km)</th><th>Municipalidad</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {lineas.map(l => (
            <tr key={l.id}>
              <td>{l.nombre}</td>
              <td>{l.distancia_total}</td>
              <td>{municipalidades.find(m => m.id === l.municipalidad_id)?.nombre || 'Sin asignar'}</td>
              <td><button onClick={() => eliminarLinea(l.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}