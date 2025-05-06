import axios from 'axios';

export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'tuo_upload_preset'); // sostituisci con il tuo
  data.append('cloud_name', 'tuo_cloud_name');       // sostituisci con il tuo

  try {
    const res = await axios.post('https://api.cloudinary.com/v1_1/tuo_cloud_name/image/upload', data);
    return res.data.secure_url;
  } catch (err) {
    console.error("Errore durante l'upload su Cloudinary", err);
    return null;
  }
};
