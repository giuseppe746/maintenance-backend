// File completo aggiornato storageUtils.js con salvaTutteLeImpostazioni()

export function creaBackupCompleto() {
  const backup = {};
  Object.keys(localStorage).forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        backup[key] = JSON.parse(value);
      } catch (e) {
        backup[key] = value;
      }
    }
  });
  return backup;
}

export function salvaTutteLeImpostazioni() {
  const impostazioni = creaBackupCompleto();
  Object.entries(impostazioni).forEach(([key, value]) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  });
  alert('✔️ Configurazioni salvate nel localStorage.');
}

export function salvaBackupSuDisco() {
  const backup = creaBackupCompleto();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Backup_impostazioni_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  localStorage.setItem("lastBackupDate", new Date().toISOString());
}

export function importaBackupDaFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        Object.keys(data).forEach((key) => {
          localStorage.setItem(key, typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]));
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function verificaBackupAutomatico(giorniBackup) {
  if (giorniBackup === 0) return;
  const lastDate = localStorage.getItem("lastBackupDate");
  const oggi = new Date();

  if (!lastDate) {
    salvaBackupSuDisco();
    return;
  }

  const ultima = new Date(lastDate);
  const diffGiorni = Math.floor((oggi - ultima) / (1000 * 60 * 60 * 24));

  if (diffGiorni >= giorniBackup) {
    salvaBackupSuDisco();
  }
}