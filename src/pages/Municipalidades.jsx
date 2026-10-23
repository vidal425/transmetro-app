import { useState, useEffect } from 'react';
import { escucharMunicipalidades, crearMunicipalidad, eliminarMunicipalidad } from '../services/municipalidadesService';

export default function Municipalidades() {
  const [municipalidades, setMunicipalidades] = useState([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const unsub = escucharMunicipalidades(setMunicipalidades);
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    await crearMunicipalidad({ nombre });
    setNombre('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Municipalidades</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la municipalidad"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#34495e', color: 'white' }}>
          <tr><th>Nombre</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {municipalidades.map(m => (
            <tr key={m.id}>
              <td>{m.nombre}</td>
              <td><button onClick={() => eliminarMunicipalidad(m.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}