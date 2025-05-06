// utils/salvaSuDisco.js

export function salvaJSON(nomeFile, contenuto) {
  try {
    const blob = new Blob([JSON.stringify(contenuto, null, 2)], {
      type: "application/json",
    });

    if (window.showSaveFilePicker) {
      window.showSaveFilePicker({
        suggestedName: nomeFile,
        types: [
          {
            description: "File JSON",
            accept: { "application/json": [".json"] },
          },
        ],
      }).then(async (handle) => {
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nomeFile;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error("Errore nel salvataggio JSON:", err);
  }
}
