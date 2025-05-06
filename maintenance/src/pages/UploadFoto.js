import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function UploadFoto() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Seleziona un file prima di caricare.');
      return;
    }

    const filePath = `${file.name}`; // 👈 Nessuna sottocartella

    const { data, error } = await supabase.storage
      .from('foto')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Errore caricamento:', error.message);
      alert('Errore nel caricamento: ' + error.message);
      return;
    }

    const { publicURL } = supabase.storage
      .from('foto')
      .getPublicUrl(filePath);

    setPublicUrl(publicURL);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Foto su Supabase</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ marginTop: '10px' }}>
          <p>Anteprima:</p>
          <img src={preview} alt="Anteprima" style={{ width: '200px' }} />
        </div>
      )}

      <button
        onClick={handleUpload}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        Carica su Supabase
      </button>

      {publicUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>URL pubblico:</p>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">{publicUrl}</a>
        </div>
      )}
    </div>
  );
}

export default UploadFoto;
