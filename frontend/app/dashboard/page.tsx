"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaFileAlt, FaFolderOpen, FaEdit, FaTrash, FaDownload } from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [tableData, setTableData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projectHistory")) || [];
    setProjects(savedProjects);
  }, []);

  const saveNewProjectToHistory = () => {
    const newProject = {
      name: "Nouveau Projet",
      date: new Date().toLocaleDateString("fr-FR"),
      status: "🟢 En cours"
    };
    const updatedProjects = [newProject, ...projects].slice(0, 6);
    setProjects(updatedProjects);
    localStorage.setItem("projectHistory", JSON.stringify(updatedProjects));
  };

  const openFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setTableData(data);
        localStorage.setItem("loadedTable", JSON.stringify(data));

        const updatedProjects = [
          {
            name: data.projectInfo?.name || "Projet sans nom",
            date: new Date().toLocaleDateString("fr-FR"),
            status: "🟢 En cours"
          },
          ...projects,
        ].slice(0, 6);

        setProjects(updatedProjects);
        localStorage.setItem("projectHistory", JSON.stringify(updatedProjects));

        alert("✅ Tableau chargé avec succès !");
        router.push("/tableau");
      } catch (error) {
        alert("❌ Erreur : Fichier invalide !");
      }
    };
    reader.readAsText(file);
  };

  const renameProject = (index) => {
    const newName = prompt("✏️ Nouveau nom du projet :", projects[index].name);
    if (newName) {
      const updated = [...projects];
      updated[index].name = newName;
      setProjects(updated);
      localStorage.setItem("projectHistory", JSON.stringify(updated));
    }
  };

  const deleteProject = (index) => {
    if (confirm("🗑️ Supprimer ce projet ?")) {
      const updated = [...projects];
      updated.splice(index, 1);
      setProjects(updated);
      localStorage.setItem("projectHistory", JSON.stringify(updated));
    }
  };

  const exportProject = (index) => {
    const data = projects[index];
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.name}.json`;
    a.click();
  };

  const lastModified = projects.length > 0 ? projects[0].date : "Aucune";
  const filteredProjects = filter === "Tous" ? projects : projects.filter(p => p.status.includes(filter));

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="h-screen bg-green-900 dark:bg-gray-900 flex flex-col text-green-900 dark:text-white">
        <div className="bg-white dark:bg-gray-800 w-64 h-full shadow-md p-4 fixed">
          <h2 className="text-xl font-semibold mb-4 text-green-800 dark:text-white">CheetahCost</h2>
          <ul className="space-y-4">
            <li
              className="cursor-pointer hover:text-green-600 dark:hover:text-green-300"
              onClick={() => {
                saveNewProjectToHistory();
                router.push("/tableau");
              }}
            >
              📄 Nouveau Projet
            </li>
            <li className="cursor-pointer hover:text-green-600 dark:hover:text-green-300">
              <label className="flex items-center space-x-2 cursor-pointer">
                <FaFolderOpen className="text-gray-600 dark:text-gray-300" />
                <span>Ouvrir un tableau</span>
                <input type="file" accept=".json" onChange={openFile} className="hidden" />
              </label>
            </li>
          </ul>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full px-4 py-2 mt-6 rounded font-semibold transition bg-green-700 text-white hover:bg-green-800 dark:bg-white dark:text-green-900 dark:hover:bg-gray-200"
          >
            {darkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
        </div>

        <div className="ml-64 p-10">
          <h1 className="text-3xl font-bold mb-6">Bienvenue</h1>

          <div className="bg-white dark:bg-gray-800 text-green-900 dark:text-white rounded-lg p-4 shadow mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">📊 Résumé</h3>
            <p>Total de projets : {projects.length}</p>
            <p>Dernière modification : {lastModified}</p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">Filtrer par statut :</label>
            <select
              className="px-4 py-2 rounded shadow text-green-900"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="Tous">Tous</option>
              <option value="🟢">🟢 En cours</option>
              <option value="🟡">🟡 En attente</option>
              <option value="🔴">🔴 Terminé</option>
            </select>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Historique</h2>
            {filteredProjects.length === 0 ? (
              <p className="text-white">Aucun projet enregistré</p>
            ) : (
              <ul className="text-white space-y-4">
                {filteredProjects.map((proj, idx) => (
                  <li key={idx} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-green-900 dark:text-white font-semibold">📁 {proj.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">🕒 Modifié : {proj.date}</p>
                      <p className="text-sm">{proj.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => renameProject(idx)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => exportProject(idx)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => deleteProject(idx)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
