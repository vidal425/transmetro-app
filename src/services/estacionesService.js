import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const estacionesRef = collection(db, 'estaciones');

export const crearEstacion = async (data) => {
  await addDoc(estacionesRef, data);
};

export const obtenerEstaciones = async () => {
  const snapshot = await getDocs(estacionesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const actualizarEstacion = async (id, data) => {
  await updateDoc(doc(db, 'estaciones', id), data);
};

export const eliminarEstacion = async (id) => {
  await deleteDoc(doc(db, 'estaciones', id));
};

export const escucharEstaciones = (callback) => {
  return onSnapshot(estacionesRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};