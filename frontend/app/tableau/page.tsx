"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { FaSave, FaFileExport, FaSyncAlt, FaPlus, FaFolderOpen, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { useSearchParams } from "next/navigation";




export default function Tableau() {
  
  const searchParams = useSearchParams();

  const [projectInfo, setProjectInfo] = useState({
    

  name: searchParams.get("nomTableau") || "Projet A",
  description: searchParams.get("entreprise") || "Entreprise inconnue",
  startDate: searchParams.get("dateCreation") || "2024-03-01",
  endDate: searchParams.get("periode") || "2024-06-01",
  responsable: searchParams.get("responsable") || "Non défini",
  budget: searchParams.get("budget") || "0",
  
  
});
const handleProjectChange = (key, value) => {
  setProjectInfo((prev) => ({ ...prev, [key]: value }));
};


const [showAvancement, setShowAvancement] = useState(true);

  const [rows, setRows] = useState([
    {
      nom: "",
      coutEstime: 0,
      coutReel: 0,
      raf: 0,
      budgetInitial: 0,
      depenses: 0,
      valeurAcquise: 0,
      cpi: 0,
      spi: 0,
      commentaires: "" // 👈 ici
      
    },
  ]);
  const [notifications, setNotifications] = useState([]);
  const showNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000); // disparaît au bout de 4s
  };
  


  const addRow = () => {
    setRows([
      ...rows,
      {
        nom: "",
        coutEstime: 0,
        coutReel: 0,
        raf: 0,
        budgetInitial: 0,
        depenses: 0,
        valeurAcquise: 0,
        cpi: 0,
        spi: 0,
        commentaires: "", // N'oublie pas ce champ si tu l'utilises
      },
    ]);
  };
  

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChange = (index, key, value) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = { ...newRows[index], [key]: value };

      // **Recalcul automatique des valeurs**
      const { coutEstime, coutReel, valeurAcquise } = newRows[index];

      newRows[index].raf = Math.max(coutEstime - coutReel, 0);
      newRows[index].cpi = coutReel !== 0 ? (valeurAcquise / coutReel).toFixed(2) : "0";
      newRows[index].spi = coutEstime !== 0 ? (valeurAcquise / coutEstime).toFixed(2) : "0";


      return newRows;
    });
  };

  

  // Sauvegarde JSON avec le bandeau + tableau
const saveAsFile = () => {
  const data = JSON.stringify({ projectInfo, rows }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tableau_complet.json";
  a.click();
};

// Chargement JSON avec projectInfo + rows
const openFile = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.rows && data.projectInfo) {
        setRows(data.rows);
        setProjectInfo(data.projectInfo);
        showNotification("✅ Données chargées avec succès !", "success");
;
      } else {
        alert("❌ Format du fichier invalide !");
      }
    } catch (error) {
      showNotification("❌ Erreur de lecture du fichier !", "error");

    }
  };
  reader.readAsText(file);
};


  // **Export en PDF**
  const exportPDF = () => {
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save("tableau.pdf");
    });
  };

  const exportExcel = () => {
    const data = rows.map((row) => ({
      Nom: row.nom,
      "Coût Estimé": row.coutEstime,
      "Coût Réel": row.coutReel,
      "Reste à Faire": row.raf,
      "Budget Initial": row.budgetInitial,
      Dépenses: row.depenses,
      "Valeur Acquise": row.valeurAcquise,
      CPI: row.cpi,
      SPI: row.spi,
      Commentaires: row.commentaires, // 👈 ici l'ajout
    }));
  
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tableau");
    XLSX.writeFile(wb, "tableau.xlsx");
  };
  

  const chartData = {
    labels: rows.map((_, i) => `Échéance ${i + 1}`),
    datasets: [
      { label: "Budget Initial", data: rows.map((row) => row.budgetInitial), borderColor: "black", borderWidth: 2, tension: 0.4 },
      { label: "Budget à Date (CP)", data: rows.map((row) => row.coutEstime), borderColor: "blue", borderWidth: 2, tension: 0.4 },
      { label: "Dépenses Réelles", data: rows.map((row) => row.depenses), borderColor: "red", borderWidth: 2, tension: 0.4 },
      { label: "Valeur Acquise (EV)", data: rows.map((row) => row.valeurAcquise), borderColor: "green", borderWidth: 2, tension: 0.4 },
    ],
  };
  <div className="fixed top-4 right-4 z-50 space-y-2">
  {notifications.map((n) => (
    <div
      key={n.id}
      className={`px-4 py-2 rounded shadow text-white text-sm transition-all duration-300 ${
        n.type === "success"
          ? "bg-green-600"
          : n.type === "error"
          ? "bg-red-600"
          : "bg-blue-600"
      }`}
    >
      {n.message}
    </div>
  ))}
</div>


  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <div className="p-4 bg-green-700 text-white rounded">
      <div className="bg-gradient-to-br from-green-700 to-green-600 text-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto mt-4">
  <h2 className="text-xl font-bold mb-4 text-center uppercase tracking-wide">Informations du projet</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>
      <label className="text-sm font-semibold block mb-1">Nom du tableau</label>
      <input
        type="text"
        value={projectInfo.name}
        onChange={(e) => handleProjectChange("name", e.target.value)}
        className="bg-white text-green-900 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
    <div>
      <label className="text-sm font-semibold block mb-1">Entreprise</label>
      <input
        type="text"
        value={projectInfo.description}
        onChange={(e) => handleProjectChange("description", e.target.value)}
        className="bg-white text-green-900 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
    <div>
      <label className="text-sm font-semibold block mb-1">Responsable</label>
      <input
        type="text"
        value={projectInfo.responsable}
        onChange={(e) => handleProjectChange("responsable", e.target.value)}
        className="bg-white text-green-900 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
    <div>
      <label className="text-sm font-semibold block mb-1">Date de création</label>
      <input
        type="date"
        value={projectInfo.startDate}
        onChange={(e) => handleProjectChange("startDate", e.target.value)}
        className="bg-white text-green-900 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
    <div>
      <label className="text-sm font-semibold block mb-1">Période</label>
      <input
        type="text"
        value={projectInfo.endDate}
        onChange={(e) => handleProjectChange("endDate", e.target.value)}
        className="bg-white text-green-900 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
    <div>
      <label className="text-sm font-semibold block mb-1">Budget (€)</label>
      <input
        type="number"
        value={projectInfo.budget}
        onChange={(e) => handleProjectChange("budget", e.target.value)}
        className="bg-white text-green-900 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  </div>

  
</div>
      </div>

      <div className="mt-4 flex gap-4">
        <button onClick={saveAsFile} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaSave /> Sauvegarder
        </button>

        <label className="bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer">
          <FaFolderOpen /> Ouvrir
          <input type="file" accept=".json" onChange={openFile} className="hidden" />
        </label>

        <button onClick={exportExcel} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaFileExport /> Exporter Excel
        </button>

        <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaFilePdf /> Exporter PDF
        </button>

        <button onClick={addRow} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaPlus /> Ajouter une ligne
        </button>

        <button
  onClick={() => {
    if (confirm("❌ Tout effacer ? Cette action est irréversible !")) {
      setRows([]);
      setProjectInfo({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        responsable: "",
        budget: "",
      });
    }
  }}
  className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
>
  ♻️ Réinitialiser
</button>

      </div>
      <div className="mt-4">
  <label className="flex items-center gap-2 text-sm">
    
   
  </label>
</div>

     
 



      <table className="mt-6 w-full border-collapse bg-white shadow-md rounded-md">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="p-2">Nom</th>
            <th className="p-2">Coût Estimé</th>
            <th className="p-2">Coût Réel</th>
            <th className="p-2">Reste à Faire</th>
            <th className="p-2">Budget Initial</th>
            <th className="p-2">Dépenses</th>
            <th className="p-2">Valeur Acquise</th>
            <th className="p-2">CPI</th>
            <th className="p-2">SPI</th>
            <th className="p-2">Commentaires</th>
            <th className="p-2">Actions</th>
            {showAvancement && <th className="p-2">Avancement</th>}

            

          </tr>
        </thead>
        
        <tbody>
  {rows.map((row, index) => (
    <tr key={index} className="text-center">
      <td><input type="text" className="w-full border p-1" value={row.nom} onChange={(e) => handleChange(index, "nom", e.target.value)} /></td>
      <td><input type="number" className="w-full border p-1" value={row.coutEstime} onChange={(e) => handleChange(index, "coutEstime", Number(e.target.value))} /></td>
      <td><input type="number" className="w-full border p-1" value={row.coutReel} onChange={(e) => handleChange(index, "coutReel", Number(e.target.value))} /></td>
      <td>{row.raf}</td>
      <td><input type="number" className="w-full border p-1" value={row.budgetInitial} onChange={(e) => handleChange(index, "budgetInitial", Number(e.target.value))} /></td>
      <td><input type="number" className="w-full border p-1" value={row.depenses} onChange={(e) => handleChange(index, "depenses", Number(e.target.value))} /></td>
      <td><input type="number" className="w-full border p-1" value={row.valeurAcquise} onChange={(e) => handleChange(index, "valeurAcquise", Number(e.target.value))} /></td>
      <td className={parseFloat(row.cpi) >= 1 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
  {row.cpi}
</td>
<td className={parseFloat(row.spi) >= 1 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
  {row.spi}
</td><td>
  <input
    type="text"
    className="w-full border p-1"
    value={row.commentaires}
    onChange={(e) => handleChange(index, "commentaires", e.target.value)}
  />
</td>




      <td><button onClick={() => removeRow(index)} className="bg-red-500 text-white p-1 rounded">🗑️</button></td>
    </tr>
    
  ))}
</tbody>

      </table>

      <div className="mt-8">
        <Line data={chartData} />
      </div>
    </div>
  );
}
