function AppContent() {
  const [interventi, setInterventi] = useState([
    {
      id: 1,
      titolo: "Sostituzione filtro aria",
      description: "Sostituzione filtro aria condizionata",
      categoria: "Impianti",
      category: "Impianti",
      status: "Inserito",
      date: "2024-03-01",
      photo: null
    },
    {
      id: 2,
      titolo: "Controllo luci emergenza",
      description: "Verifica funzionalità luci emergenza",
      categoria: "Sicurezza",
      category: "Sicurezza",
      status: "Da completare",
      date: "2024-03-03",
      photo: null
    }
  ]);

  useEffect(() => {
    localStorage.setItem("interventi", JSON.stringify(interventi));
  }, [interventi]);
