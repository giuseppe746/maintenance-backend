import { useEffect, useRef } from "react";
import { saveToBackupBlob } from "../utils/backup";

const BackupAutomatico = () => {
  const giaAvviato = useRef(false);

  useEffect(() => {
    const attivo = localStorage.getItem("autoBackupAttivo") === "true";
    if (!attivo || giaAvviato.current) return;

    const intervalloMinuti = parseInt(localStorage.getItem("backupIntervalMin")) || 5;
    const intervalloMs = intervalloMinuti * 60 * 1000;

    const eseguiBackup = () => {
      const dati = JSON.parse(localStorage.getItem("interventi")) || [];
      // Salvataggio silenzioso (no download)
saveToBackupBlob(dati);
      console.log(`[Backup Programmato] ${new Date().toLocaleTimeString()}`);
    };

    const timer = setInterval(eseguiBackup, intervalloMs);
    eseguiBackup();
    giaAvviato.current = true;

    return () => clearInterval(timer);
  }, []);

  return null;
};

export default BackupAutomatico;



