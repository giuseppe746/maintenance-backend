// Storico aggiornato per usare API_URL da config.js
import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { API_URL } from '../config';

function Storico() {
  const [interventi, setInterventi] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte');
  const [categorieDisponibili, setCategorieDisponibili] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [colorCompletati, setColorCompletati] = useState('#28a745');
  const [colorDaCompletare, setColorDaCompletare] = useState('#ffc107');
  const [colorGrafico, setColorGrafico] = useState('#007bff');
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [bgColor, setBgColor] = useState('#f4f4f4');
  const [textColor, setTextColor] = useState('#000000');

  useEffect(() => {
    const bg = localStorage.getItem('storicoColor');
    const txt = localStorage.getItem('storicoTextColor');
    if (bg) setBgColor(bg);
    if (txt) setTextColor(txt);

    // Carica impostazioni dal backend
    fetch(`${API_URL}/impostazioni`)
      .then(res => res.json())
      .then(data => {
        if (data.chartType) setChartType(data.chartType);
        if (data.colorGrafico) setColorGrafico(data.colorGrafico);
        if (data.colorCompletati) setColorCompletati(data.colorCompletati);
        if (data.colorDaCompletare) setColorDaCompletare(data.colorDaCompletare);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/interventi`)
      .then(res => res.json())
      .then(data => {
        const filtrati = data
          .filter(i => i.esitoCollaudo && i.dataCollaudo)
          .map(i => ({
            id: i.id,
            data: i.dataCollaudo,
            categoria: i.categoria,
            descrizione: i.descrizione || i.description || 'Intervento',
            collaudatoDa: i.collaudatoDa || 'N/A',
            esito: i.esitoCollaudo
          }));

        setInterventi(filtrati);
        setCategorieDisponibili([...new Set(filtrati.map(i => i.categoria))]);
      });
  }, []);

  const interventiFiltrati = interventi.filter(i => filtroCategoria === 'Tutte' || i.categoria === filtroCategoria);

  const dataEsiti = [
    { name: 'Positivi', value: interventiFiltrati.filter(i => i.esito === 'positivo').length, color: colorCompletati },
    { name: 'Negativi', value: interventiFiltrati.filter(i => i.esito === 'negativo').length, color: colorDaCompletare }
  ];

  const dataCategorie = [...new Set(interventiFiltrati.map(i => i.categoria))].map(cat => ({
    categoria: cat,
    totale: interventiFiltrati.filter(i => i.categoria === cat).length
  }));

  const renderGraficoEsiti = () => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie dataKey="value" data={dataEsiti} nameKey="name" outerRadius={80} label>
              {dataEsiti.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={dataEsiti}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {dataEsiti.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: bgColor, color: textColor, minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center' }}>Storico Interventi</h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        <button onClick={() => window.print()} style={buttonStyle}>Stampa</button>
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={buttonStyle}>
          <option value="Tutte">Tutte le Categorie</option>
          {categorieDisponibili.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        <div ref={pieChartRef} style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', height: '300px' }}>
          <h4 style={{ textAlign: 'center' }}>Esiti Collaudo</h4>
          <ResponsiveContainer width="100%" height="90%">
            {renderGraficoEsiti()}
          </ResponsiveContainer>
        </div>

        <div ref={barChartRef} style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', height: '300px' }}>
          <h4 style={{ textAlign: 'center' }}>Interventi per Categoria</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dataCategorie}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totale" fill={colorGrafico} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: '0 5px',
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Storico;



