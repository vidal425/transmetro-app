import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const ref = collection(db, 'accesos');

export const crearAcceso = (data) => addDoc(ref, data);
export const obtenerAccesos = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const eliminarAcceso = (id) => deleteDoc(doc(db, 'accesos', id));
export const escucharAccesos = (cb) => onSnapshot(ref, s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));