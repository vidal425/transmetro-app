import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { escucharPilotos, crearPiloto, eliminarPiloto, actualizarPiloto } from '../services/pilotosService';
import { escucharBuses } from '../services/busesService';

export default function Pilotos() {
  const [pilotos, setPilotos] = useState([]);
  const [buses, setBuses] = useState([]);
  const [nombre, setNombre] = useState('');
  const [dpi, setDpi] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [residencia, setResidencia] = useState('');
  const [historial, setHistorial] = useState('');

  useEffect(() => {
    const u1 = escucharPilotos(setPilotos);
    const u2 = escucharBuses(setBuses);
    return () => { u1(); u2(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    // Se crea el piloto sin bus asignado (para romper la dependencia circular)
    await crearPiloto({
      nombre, dpi, telefono, correo, residencia, historial_educativo: historial,
      bus_id: ''
    });
    setNombre(''); setDpi(''); setTelefono(''); setCorreo('');
    setResidencia(''); setHistorial('');
  };

  // Función para asignar un bus desde la tabla
  const handleAsignarBus = async (pilotoId, busId) => {
    await actualizarPiloto(pilotoId, { bus_id: busId });
  };

  return (
    <PageLayout title="Gestión de Pilotos">
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" style={{ padding: '8px' }} required />
        <input type="text" value={dpi} onChange={(e) => setDpi(e.target.value)} placeholder="DPI" style={{ padding: '8px' }} />
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" style={{ padding: '8px' }} />
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo electrónico" style={{ padding: '8px' }} />
        <input type="text" value={residencia} onChange={(e) => setResidencia(e.target.value)} placeholder="Residencia" style={{ padding: '8px' }} />
        <input type="text" value={historial} onChange={(e) => setHistorial(e.target.value)} placeholder="Historial educativo" style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', gridColumn: 'span 2' }}>Agregar Piloto</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#8e44ad', color: 'white' }}>
          <tr>
            <th>Nombre</th>
            <th>DPI</th>
            <th>Teléfono</th>
            <th>Historial</th>
            <th>Bus Asignado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pilotos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.dpi}</td>
              <td>{p.telefono}</td>
              <td>{p.historial_educativo}</td>
              <td>
                {/* SELECTOR MÁGICO PARA ASIGNAR BUS */}
                <select 
                  value={p.bus_id || ''} 
                  onChange={(e) => handleAsignarBus(p.id, e.target.value)}
                  style={{ padding: '5px', backgroundColor: p.bus_id ? '#d4edda' : 'white' }}
                >
                  <option value="">Sin asignar</option>
                  {buses.map(b => (
                    <option key={b.id} value={b.id}>{b.placa}</option>
                  ))}
                </select>
              </td>
              <td><button onClick={() => eliminarPiloto(p.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}