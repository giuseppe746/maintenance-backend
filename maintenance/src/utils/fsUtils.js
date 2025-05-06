// /src/utils/fsUtils.js
import { get, set } from 'idb-keyval';

const FOTO_DIR_KEY = 'fotoDirectoryHandle';

// Salva la directory scelta in modo persistente
export async function salvaDirectoryHandle(handle) {
  if (handle && (await handle.queryPermission({ mode: 'readwrite' })) === 'granted') {
    await set(FOTO_DIR_KEY, handle);
  }
}

// Recupera la directory salvata
export async function recuperaDirectoryHandle() {
  const handle = await get(FOTO_DIR_KEY);
  if (!handle) return null;

  const permission = await handle.queryPermission({ mode: 'readwrite' });
  if (permission === 'granted') {
    return handle;
  } else {
    const request = await handle.requestPermission({ mode: 'readwrite' });
    return request === 'granted' ? handle : null;
  }
}

// Salva un file immagine nella directory scelta
export async function salvaFotoInCartella(handle, fileName, blob) {
  const fileHandle = await handle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}
