import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ref = collection(db, 'distancias');

export const crearDistancia = (data) => addDoc(ref, data);
export const obtenerDistancias = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const eliminarDistancia = (id) => deleteDoc(doc(db, 'distancias', id));
export const escucharDistancias = (cb) => onSnapshot(ref, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));