import { useState, useEffect } from 'react';
import { escucharAlertas, eliminarAlerta, actualizarAlerta } from '../services/alertasService';

export default function Alertas() {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const unsub = escucharAlertas(setAlertas);
    return () => unsub();
  }, []);

  const alertasActivas = alertas.filter(a => a.estado === 'activa');

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sistema de Alertas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#e74c3c', color: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Alertas Activas</h3>
          <h1>{alertasActivas.length}</h1>
        </div>
        <div style={{ background: '#f39c12', color: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Total Histórico</h3>
          <h1>{alertas.length}</h1>
        </div>
        <div style={{ background: '#27ae60', color: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Resueltas</h3>
          <h1>{alertas.filter(a => a.estado === 'resuelta').length}</h1>
        </div>
      </div>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#c0392b', color: 'white' }}>
          <tr>
            <th>Tipo</th>
            <th>Mensaje</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alertas.map(a => (
            <tr key={a.id} style={{ background: a.estado === 'activa' ? '#fdebd0' : 'white' }}>
              <td>{a.tipo}</td>
              <td>{a.mensaje}</td>
              <td>{a.fecha ? new Date(a.fecha).toLocaleString() : '-'}</td>
              <td>{a.estado}</td>
              <td>
                {a.estado === 'activa' && (
                  <button
                    onClick={() => actualizarAlerta(a.id, { estado: 'resuelta' })}
                    style={{ background: '#27ae60', marginRight: '5px' }}
                  >
                    Resolver
                  </button>
                )}
                <button onClick={() => eliminarAlerta(a.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}