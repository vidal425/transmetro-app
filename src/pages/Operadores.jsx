import { useState, useEffect } from 'react';
import { escucharOperadores, crearOperador, eliminarOperador } from '../services/operadoresService';
import { escucharEstaciones } from '../services/estacionesService';

export default function Operadores() {
  const [operadores, setOperadores] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [estacionId, setEstacionId] = useState('');

  useEffect(() => {
    const u1 = escucharOperadores(setOperadores);
    const u2 = escucharEstaciones(setEstaciones);
    return () => { u1(); u2(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    await crearOperador({
      nombre,
      usuario,
      estacion_id: estacionId,
      rol: 'operador'
    });
    setNombre('');
    setUsuario('');
    setEstacionId('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Operadores</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del operador" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Usuario" style={{ padding: '8px', marginRight: '10px' }} />
        <select value={estacionId} onChange={(e) => setEstacionId(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="">Seleccionar estación</option>
          {estaciones.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#2980b9', color: 'white' }}>
          <tr><th>Nombre</th><th>Usuario</th><th>Estación</th><th>Rol</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {operadores.map(o => (
            <tr key={o.id}>
              <td>{o.nombre}</td>
              <td>{o.usuario}</td>
              <td>{estaciones.find(e => e.id === o.estacion_id)?.nombre || 'Sin asignar'}</td>
              <td>{o.rol}</td>
              <td><button onClick={() => eliminarOperador(o.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}