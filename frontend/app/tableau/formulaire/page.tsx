"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaBuilding, FaCalendarAlt, FaTags, FaMoneyBill, FaChartLine } from "react-icons/fa";

export default function FormulaireTableau() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nomTableau: "",
        entreprise: "",
        responsable: "",
        dateCreation: new Date().toISOString().split("T")[0],
        budget: "",
        methodeCalcul: "",
        monnaie: "EUR", // Par défaut, Euro
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Sauvegarde des données dans localStorage
        localStorage.setItem("tableauData", JSON.stringify(formData));

        console.log("Données du formulaire sauvegardées :", formData);
        
        // Redirection vers la page du tableau
        router.push("/tableau");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-900 p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Créer un nouveau tableau</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border p-3 rounded-md">
                        <FaTags className="text-gray-500 mr-2" />
                        <input type="text" name="nomTableau" placeholder="Nom du tableau" className="w-full focus:outline-none" 
                            onChange={handleChange} value={formData.nomTableau} required />
                    </div>
                    <div className="flex items-center border p-3 rounded-md">
                        <FaBuilding className="text-gray-500 mr-2" />
                        <input type="text" name="entreprise" placeholder="Entreprise / Projet" className="w-full focus:outline-none" 
                            onChange={handleChange} value={formData.entreprise} required />
                    </div>
                    <div className="flex items-center border p-3 rounded-md">
                        <FaUser className="text-gray-500 mr-2" />
                        <input type="text" name="responsable" placeholder="Nom du responsable" className="w-full focus:outline-none" 
                            onChange={handleChange} value={formData.responsable} required />
                    </div>
                    <div className="flex items-center border p-3 rounded-md">
                        <FaCalendarAlt className="text-gray-500 mr-2" />
                        <input type="date" name="dateCreation" className="w-full focus:outline-none" 
                            onChange={handleChange} value={formData.dateCreation} required />
                    </div>
                    <div className="flex items-center border p-3 rounded-md">
                        <FaMoneyBill className="text-gray-500 mr-2" />
                        <input type="number" name="budget" placeholder="Montant total du projet" className="w-full focus:outline-none" 
                            onChange={handleChange} value={formData.budget} required />
                    </div>
                    
                    {/* Liste déroulante pour choisir la monnaie */}
                    <div className="flex items-center border p-3 rounded-md">
                        <FaChartLine className="text-gray-500 mr-2" />
                        <select name="monnaie" className="w-full focus:outline-none bg-white" onChange={handleChange} value={formData.monnaie} required>
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">Dollar ($)</option>
                            <option value="GBP">Livre Sterling (£)</option>
                            <option value="JPY">Yen Japonais (¥)</option>
                            <option value="CRYPTO">Cryptomonnaie (BTC, ETH, etc.)</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-md font-bold">Créer le tableau</button>
                </form>
            </div>
        </div>
    );
}
