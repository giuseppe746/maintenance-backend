export const saveToBackupFile = (data, filename = "backup_interventi.json") => {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (error) {
    console.error("Errore nel salvataggio su file:", error);
  }
};

export const saveToBackupBlob = (data) => {
  try {
    return new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  } catch (error) {
    console.error("Errore nella creazione del backup blob:", error);
    return null;
  }
};
