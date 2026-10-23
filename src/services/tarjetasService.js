import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const ref = collection(db, 'tarjetas');

export const crearTarjeta = (data) => addDoc(ref, {
  ...data,
  saldo: data.saldo || 0,
  estado: 'activa',
  fecha_emision: new Date().toISOString()
});

export const obtenerTarjetas = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const actualizarTarjeta = (id, data) => updateDoc(doc(db, 'tarjetas', id), data);

export const eliminarTarjeta = (id) => deleteDoc(doc(db, 'tarjetas', id));

export const escucharTarjetas = (cb) => onSnapshot(ref, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));