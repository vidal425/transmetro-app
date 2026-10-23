import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { escucharTarjetas, crearTarjeta, eliminarTarjeta, actualizarTarjeta } from '../services/tarjetasService';

export default function Tarjetas() {
  const [tarjetas, setTarjetas] = useState([]);
  const [numero, setNumero] = useState('');
  const [titular, setTitular] = useState('');
  const [saldo, setSaldo] = useState('');

  useEffect(() => {
    const unsub = escucharTarjetas(setTarjetas);
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numero.trim()) return;
    await crearTarjeta({
      numero,
      titular,
      saldo: Number(saldo) || 0
    });
    setNumero(''); setTitular(''); setSaldo('');
  };

  const recargar = async (tarjeta) => {
    const monto = prompt('Monto a recargar (Q):');
    if (!monto) return;
    const nuevoSaldo = (tarjeta.saldo || 0) + Number(monto);
    await actualizarTarjeta(tarjeta.id, { saldo: nuevoSaldo });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold', display: 'inline-block', marginBottom: '20px' }}>
        ⬅️ Volver al Panel Principal
      </Link>

      <h2>Gestión de Tarjetas Ciudadanas</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número de tarjeta" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="text" value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Nombre del titular" style={{ padding: '8px', marginRight: '10px' }} />
        <input type="number" value={saldo} onChange={(e) => setSaldo(e.target.value)} placeholder="Saldo inicial (Q)" style={{ padding: '8px', marginRight: '10px' }} />
        <button type="submit" style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}>Crear Tarjeta</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{ background: '#2980b9', color: 'white' }}>
          <tr>
            <th>Número</th>
            <th>Titular</th>
            <th>Saldo</th>
            <th>Estado</th>
            <th>Fecha emisión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tarjetas.map(t => (
            <tr key={t.id}>
              <td>{t.numero}</td>
              <td>{t.titular}</td>
              <td>Q{t.saldo?.toFixed(2) || '0.00'}</td>
              <td>{t.estado}</td>
              <td>{t.fecha_emision ? new Date(t.fecha_emision).toLocaleDateString() : '-'}</td>
              <td>
                <button onClick={() => recargar(t)} style={{ marginRight: '5px', background: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Recargar</button>
                <button onClick={() => eliminarTarjeta(t.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}