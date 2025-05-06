import jsPDF from "jspdf";
import "jspdf-autotable";
import React from "react";
import { Button } from "@/components/ui/button";  // Usa il tuo sistema di UI

const ReportPDF = ({ interventi }) => {
  const generaPDF = () => {
    const doc = new jsPDF();
    doc.text("Report Interventi di Manutenzione", 10, 10);

    const tableColumn = ["ID", "Descrizione", "Data", "Stato"];
    const tableRows = [];

    interventi.forEach((intervento) => {
      const rowData = [
        intervento.id,
        intervento.descrizione,
        new Date(intervento.data).toLocaleDateString(),
        intervento.stato,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("report_interventi.pdf");
  };

  return <Button onClick={generaPDF}>Esporta in PDF</Button>;
};

export default ReportPDF;
