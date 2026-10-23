import { useState, useEffect } from 'react';
import { escucharLineas } from '../services/lineasService';
import { escucharEstaciones } from '../services/estacionesService';
import { escucharBuses } from '../services/busesService';
import { escucharPilotos } from '../services/pilotosService';
import { escucharAlertas } from '../services/alertasService';
import { escucharMunicipalidades } from '../services/municipalidadesService';
import { escucharParqueos } from '../services/parqueosService'; // <-- NUEVA IMPORTACIÓN
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [lineas, setLineas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [buses, setBuses] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [parqueos, setParqueos] = useState([]); // <-- NUEVO ESTADO

  useEffect(() => {
    const u1 = escucharLineas(setLineas);
    const u2 = escucharEstaciones(setEstaciones);
    const u3 = escucharBuses(setBuses);
    const u4 = escucharPilotos(setPilotos);
    const u5 = escucharAlertas(setAlertas);
    const u6 = escucharMunicipalidades(setMunicipalidades);
    const u7 = escucharParqueos(setParqueos); // <-- NUEVO ESCUCHADOR
    
    return () => { u1(); u2(); u3(); u4(); u5(); u6(); u7(); };
  }, []);

  const alertasActivas = alertas.filter(a => a.estado === 'activa');

  const cardStyle = (color) => ({
    background: color,
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'block'
  });

  // AQUÍ ESTÁ LA CORRECCIÓN: Ahora valida parqueos.length > 0
  const pasos = [
    { nombre: 'Municipalidades', listo: municipalidades.length > 0, ruta: '/municipalidades', num: 1 },
    { nombre: 'Líneas', listo: lineas.length > 0, ruta: '/lineas', num: 2 },
    { nombre: 'Estaciones', listo: estaciones.length > 0, ruta: '/estaciones', num: 3 },
    { nombre: 'Parqueos', listo: parqueos.length > 0, ruta: '/parqueos', num: 4 }, // <-- CORREGIDO
    { nombre: 'Pilotos', listo: pilotos.length > 0, ruta: '/pilotos', num: 5 },
    { nombre: 'Buses', listo: buses.length > 0, ruta: '/buses', num: 6 },
  ];

  return (
    <div style={{ padding: '30px' }}>
      <h1>Panel de Control - Transmetro</h1>
      <p>Bienvenido al sistema de control del Transmetro.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginTop: '30px' }}>
        <Link to="/lineas" style={cardStyle('#3498db')}>
          <h3>Líneas</h3>
          <h1>{lineas.length}</h1>
        </Link>
        <Link to="/estaciones" style={cardStyle('#27ae60')}>
          <h3>Estaciones</h3>
          <h1>{estaciones.length}</h1>
        </Link>
        <Link to="/buses" style={cardStyle('#e67e22')}>
          <h3>Buses</h3>
          <h1>{buses.length}</h1>
        </Link>
        <Link to="/pilotos" style={cardStyle('#8e44ad')}>
          <h3>Pilotos</h3>
          <h1>{pilotos.length}</h1>
        </Link>
        <Link to="/alertas" style={cardStyle('#e74c3c')}>
          <h3>🔔 Alertas Activas</h3>
          <h1>{alertasActivas.length}</h1>
        </Link>
      </div>

      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #3498db' }}>
        <h3>📋 Orden recomendado para registrar datos</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          El sistema tiene dependencias entre entidades. Sigue este orden para evitar errores:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '15px' }}>
          {pasos.map(p => (
            <Link
              key={p.num}
              to={p.ruta}
              style={{
                padding: '12px',
                borderRadius: '6px',
                textDecoration: 'none',
                background: p.listo ? '#d4edda' : '#fff3cd',
                color: p.listo ? '#155724' : '#856404',
                border: `1px solid ${p.listo ? '#c3e6cb' : '#ffeaa7'}`
              }}
            >
              <strong>{p.num}️⃣ {p.nombre}</strong><br />
              <span style={{ fontSize: '12px' }}>{p.listo ? '✅ Registrado' : '⚠️ Pendiente'}</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>Últimas alertas</h3>
        {alertasActivas.length === 0 ? (
          <p>No hay alertas activas.</p>
        ) : (
          <ul>
            {alertasActivas.slice(0, 5).map(a => (
              <li key={a.id} style={{ color: 'red' }}>🔴 {a.mensaje}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}