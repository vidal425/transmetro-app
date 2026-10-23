import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';

const ref = collection(db, 'alertas');

export const crearAlerta = (data) => addDoc(ref, {
  ...data,
  fecha: new Date().toISOString(),
  estado: 'activa'
});
export const obtenerAlertas = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const actualizarAlerta = (id, data) => updateDoc(doc(db, 'alertas', id), data);
export const eliminarAlerta = (id) => deleteDoc(doc(db, 'alertas', id));
export const escucharAlertas = (cb) => onSnapshot(ref, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));
export const escucharAlertasActivas = (cb) => {
  const q = query(ref, where('estado', '==', 'activa'));
  return onSnapshot(q, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));
};