import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const lineasRef = collection(db, 'lineas');

export const crearLinea = async (data) => {
  await addDoc(lineasRef, data);
};

export const obtenerLineas = async () => {
  const snapshot = await getDocs(lineasRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const actualizarLinea = async (id, data) => {
  await updateDoc(doc(db, 'lineas', id), data);
};

export const eliminarLinea = async (id) => {
  await deleteDoc(doc(db, 'lineas', id));
};

export const escucharLineas = (callback) => {
  return onSnapshot(lineasRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};