import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { escucharBuses, crearBus, eliminarBus, actualizarBus } from '../services/busesService';
import { escucharLineas } from '../services/lineasService';
import { escucharParqueos } from '../services/parqueosService';
import { escucharPilotos } from '../services/pilotosService';
import { crearAlerta } from '../services/alertasService';
import { obtenerEstaciones } from '../services/estacionesService';

export default function Buses() {
  const [buses, setBuses] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [parqueos, setParqueos] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [placa, setPlaca] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [lineaId, setLineaId] = useState('');
  const [parqueoId, setParqueoId] = useState('');
  const [pilotoId, setPilotoId] = useState('');

  useEffect(() => {
    const u1 = escucharBuses(setBuses);
    const u2 = escucharLineas(setLineas);
    const u3 = escucharParqueos(setParqueos);
    const u4 = escucharPilotos(setPilotos);
    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placa.trim()) return;
    if (lineas.length === 0 || parqueos.length === 0) {
      alert('⚠️ Faltan Líneas o Parqueos creados.');
      return;
    }
    if (!parqueoId) {
      alert('⚠️ Requerimiento 7: Un bus debe tener un parqueo asignado.');
      return;
    }
    if (lineaId) {
      const estaciones = await obtenerEstaciones();
      const nEstaciones = estaciones.filter(est => (est.lineas_ids || []).includes(lineaId) || est.linea_id === lineaId).length;
      const busesLinea = buses.filter(b => b.linea_id === lineaId).length;
      if (nEstaciones > 0 && busesLinea >= nEstaciones * 2) {
        alert(`⚠️ Requerimiento 5: La línea ya tiene el máximo de buses permitido (${nEstaciones * 2}).`);
        return;
      }
    }
    await crearBus({ placa, capacidad_maxima: Number(capacidad) || 80, ocupacion_actual: 0, linea_id: lineaId, parqueo_id: parqueoId, piloto_id: pilotoId, estado: 'estacionado' });
    setPlaca(''); setCapacidad(''); setLineaId(''); setParqueoId(''); setPilotoId('');
  };

  const simularOcupacion = async (bus, nuevaOcupacion) => {
    const porcentaje = (nuevaOcupacion / bus.capacidad_maxima) * 100;
    if (porcentaje >= 50) {
      await crearAlerta({ tipo: 'capacidad_excedida', bus_id: bus.id, bus_placa: bus.placa, mensaje: `Bus ${bus.placa} al ${porcentaje.toFixed(0)}% de capacidad.`, porcentaje: porcentaje.toFixed(0) });
    }
    if (porcentaje < 25) {
      alert(`Requerimiento 15: Bus ${bus.placa} al ${porcentaje.toFixed(0)}%. Debe esperar 5 minutos más.`);
    }
    await actualizarBus(bus.id, { ocupacion_actual: nuevaOcupacion });
  };

  // Función para asignar un piloto desde la tabla
  const handleAsignarPiloto = async (busId, nuevoPilotoId) => {
    await actualizarBus(busId, { piloto_id: nuevoPilotoId });
  };

  const selectStyle = (valor) => ({
    padding: '8px', marginRight: '10px',
    backgroundColor: valor ? '#d4edda' : 'white',
    border: valor ? '2px solid #27ae60' : '1px solid #ccc',
    borderRadius: '4px'
  });

  return (
    <PageLayout title="Gestión de Buses">
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="Placa" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="number" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} placeholder="Capacidad" style={{ padding: '8px', marginRight: '10px' }} />
        
        <select value={lineaId} onChange={(e) => setLineaId(e.target.value)} style={selectStyle(lineaId)}>
          <option value="">Línea</option>
          {lineas.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
        </select>
        <select value={parqueoId} onChange={(e) => setParqueoId(e.target.value)} style={selectStyle(parqueoId)}>
          <option value="">Parqueo *</option>
          {parqueos.map(p => <option key={p.id} value={p.id}>{p.ubicacion}</option>)}
        </select>
        <select value={pilotoId} onChange={(e) => setPilotoId(e.target.value)} style={selectStyle(pilotoId)}>
          <option value="">Piloto (opcional)</option>
          {pilotos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#e67e22', color: 'white' }}>
          <tr><th>Placa</th><th>Línea</th><th>Parqueo</th><th>Piloto Asignado</th><th>Ocupación</th><th>Simular</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {buses.map(bus => {
            const porc = bus.capacidad_maxima ? ((bus.ocupacion_actual / bus.capacidad_maxima) * 100).toFixed(0) : 0;
            return (
              <tr key={bus.id} style={{ background: porc >= 50 ? '#fadbd8' : porc < 25 && porc > 0 ? '#fdebd0' : 'white' }}>
                <td>{bus.placa}</td>
                <td>{lineas.find(l => l.id === bus.linea_id)?.nombre || '-'}</td>
                <td>{parqueos.find(p => p.id === bus.parqueo_id)?.ubicacion || '-'}</td>
                <td>
                  {/* SELECTOR MÁGICO PARA ASIGNAR PILOTO */}
                  <select 
                    value={bus.piloto_id || ''} 
                    onChange={(e) => handleAsignarPiloto(bus.id, e.target.value)}
                    style={{ padding: '5px', backgroundColor: bus.piloto_id ? '#d4edda' : 'white' }}
                  >
                    <option value="">Sin asignar</option>
                    {pilotos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </td>
                <td>{bus.ocupacion_actual} / {bus.capacidad_maxima} ({porc}%)</td>
                <td>
                  <input type="number" placeholder="Ocup." style={{ width: '60px', padding: '4px' }} onBlur={(e) => {
                      const valor = Number(e.target.value);
                      if (valor >= 0 && valor <= bus.capacidad_maxima) { simularOcupacion(bus, valor); }
                  }} />
                </td>
                <td><button onClick={() => eliminarBus(bus.id)}>Eliminar</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </PageLayout>
  );
}