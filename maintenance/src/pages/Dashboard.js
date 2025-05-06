import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { API_URL } from '../config';

const Dashboard = () => {
  const [interventi, setInterventi] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [colorCompletati, setColorCompletati] = useState('#28a745');
  const [colorDaCompletare, setColorDaCompletare] = useState('#ffc107');
  const [colorGrafico, setColorGrafico] = useState('#007bff');

  useEffect(() => {
    fetch(`${API_URL}/interventi`)
      .then(res => res.json())
      .then(setInterventi)
      .catch(() => setInterventi([]));

    fetch(`${API_URL}/impostazioni`)
      .then(res => res.json())
      .then(data => {
        if (data.chartType) setChartType(data.chartType);
        if (data.colorGrafico) setColorGrafico(data.colorGrafico);
        if (data.colorCompletati) setColorCompletati(data.colorCompletati);
        if (data.colorDaCompletare) setColorDaCompletare(data.colorDaCompletare);

        if (data.dashboardColor) document.body.style.backgroundColor = data.dashboardColor;
        if (data.dashboardTextColor) document.body.style.color = data.dashboardTextColor;
      });

    return () => {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    };
  }, []);

  const completati = interventi.filter(i => i.status === "Completato").length;
  const daCompletare = interventi.filter(i => i.status === "Da completare").length;
  const totale = completati + daCompletare;

  const perCategoria = interventi.reduce((acc, curr) => {
    acc[curr.categoria] = (acc[curr.categoria] || 0) + 1;
    return acc;
  }, {});

  const dataStato = [
    { name: 'Completati', valore: completati, color: colorCompletati },
    { name: 'Da completare', valore: daCompletare, color: colorDaCompletare }
  ];

  const dataCategoria = Object.entries(perCategoria).map(([name, valore]) => ({ name, valore }));

  const renderGrafico = (data, title) => {
    const commonHeight = 400;

    switch (chartType) {
      case 'bar':
        return (
          <div className="grafico-box">
            <h4>{title}</h4>
            <ResponsiveContainer width="100%" height={commonHeight}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valore" fill={colorGrafico} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'pie':
        return (
          <div className="grafico-box">
            <h4>{title}</h4>
            <ResponsiveContainer width="100%" height={commonHeight}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="valore"
                  nameKey="name"
                  outerRadius={130}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || colorGrafico} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'line':
        return (
          <div className="grafico-box">
            <h4>{title}</h4>
            <ResponsiveContainer width="100%" height={commonHeight}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valore" stroke={colorGrafico} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Benvenuto nella Dashboard</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          maxWidth: '100%',
          margin: '0 auto'
        }}
      >
        {renderGrafico(dataStato, "Interventi Completati vs Da Completare")}
        {renderGrafico([{ name: "Totale Interventi", valore: totale, color: colorGrafico }], "Totale Interventi")}
        {renderGrafico(dataCategoria, "Interventi per Categoria")}
      </div>
    </div>
  );
};

export default Dashboard;
