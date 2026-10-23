import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { escucharLineas } from '../services/lineasService';
import { escucharEstaciones } from '../services/estacionesService';
import { escucharBuses } from '../services/busesService';

export default function Reportes() {
  const [lineas, setLineas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const u1 = escucharLineas(setLineas);
    const u2 = escucharEstaciones(setEstaciones);
    const u3 = escucharBuses(setBuses);
    return () => { u1(); u2(); u3(); };
  }, []);

  return (
    <PageLayout title="Reportes del Sistema">
      {/* REPORTE 1: Estaciones por Línea */}
      <div style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>📍 Reporte 1: Estaciones por Línea</h3>
        {lineas.map(linea => {
          // LA CORRECCIÓN ESTÁ AQUÍ: Buscamos dentro del arreglo lineas_ids
          const estLinea = estaciones.filter(est => 
            (est.lineas_ids && est.lineas_ids.includes(linea.id)) || 
            (est.linea_id === linea.id) // Por si queda algún registro viejo
          );
          
          return (
            <div key={linea.id} style={{ marginBottom: '15px', padding: '10px', borderLeft: '4px solid #3498db', background: '#f9f9f9' }}>
              <strong>{linea.nombre}</strong> - {estLinea.length} estaciones
              {estLinea.length > 0 && (
                <ul style={{ marginTop: '10px', marginBottom: '0' }}>
                  {estLinea.map(e => <li key={e.id}>{e.nombre} (Cap: {e.capacidad_maxima})</li>)}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* REPORTE 2: Buses por Línea */}
      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>🚌 Reporte 2: Buses por Línea</h3>
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead style={{ background: '#e67e22', color: 'white' }}>
            <tr>
              <th>Línea</th>
              <th>N° Estaciones</th>
              <th>N° Buses</th>
              <th>Mínimo (N)</th>
              <th>Máximo (2N)</th>
              <th>Cumple</th>
            </tr>
          </thead>
          <tbody>
            {lineas.map(linea => {
              // LA MISMA CORRECCIÓN AQUÍ
              const nEst = estaciones.filter(est => 
                (est.lineas_ids && est.lineas_ids.includes(linea.id)) || 
                (est.linea_id === linea.id)
              ).length;
              
              const nBus = buses.filter(b => b.linea_id === linea.id).length;
              const cumple = nBus >= nEst && nBus <= nEst * 2;
              
              return (
                <tr key={linea.id}>
                  <td>{linea.nombre}</td>
                  <td>{nEst}</td>
                  <td>{nBus}</td>
                  <td>{nEst}</td>
                  <td>{nEst * 2}</td>
                  <td style={{ color: cumple ? 'green' : 'red', fontWeight: 'bold' }}>
                    {cumple ? '✅ Sí' : '❌ No'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* REPORTE 3: Estado de Buses */}
      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>📊 Reporte 3: Estado de Buses y Ocupación</h3>
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead style={{ background: '#8e44ad', color: 'white' }}>
            <tr>
              <th>Placa</th>
              <th>Línea</th>
              <th>Capacidad</th>
              <th>Ocupación</th>
              <th>% Ocupación</th>
              <th>Estado</th>
              <th>Alerta</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(b => {
              const porc = b.capacidad_maxima ? ((b.ocupacion_actual / b.capacidad_maxima) * 100).toFixed(0) : 0;
              let alerta = '✅ Normal';
              let color = 'green';
              if (porc >= 50) { alerta = '🔴 Saturación'; color = 'red'; }
              else if (porc < 25) { alerta = '🟡 Baja ocupación'; color = 'orange'; }
              
              return (
                <tr key={b.id}>
                  <td>{b.placa}</td>
                  <td>{lineas.find(l => l.id === b.linea_id)?.nombre || '-'}</td>
                  <td>{b.capacidad_maxima}</td>
                  <td>{b.ocupacion_actual}</td>
                  <td>{porc}%</td>
                  <td>{b.estado}</td>
                  <td style={{ color, fontWeight: 'bold' }}>{alerta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}