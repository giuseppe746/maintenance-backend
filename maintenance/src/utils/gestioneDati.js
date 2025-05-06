// utils/gestioneDati.js

export function aggiungiIntervento(intervento) {
  const esistenti = JSON.parse(localStorage.getItem("interventi")) || [];
  esistenti.push(intervento);
  localStorage.setItem("interventi", JSON.stringify(esistenti));
}

export function salvaFoto(tipo, id, base64Image) {
  const key = `foto_${tipo}_${id}`;
  localStorage.setItem(key, base64Image);
}

export function getFoto(tipo, id) {
  const key = `foto_${tipo}_${id}`;
  return localStorage.getItem(key);
}
