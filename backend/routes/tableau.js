const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();
const storagePath = path.join(__dirname, '../storage/tableaux');

// Vérifier que le dossier de stockage existe
fs.ensureDirSync(storagePath);

// 📌 1. Sauvegarder un tableau en local
router.post('/save', async (req, res) => {
    try {
        const { name, data } = req.body;
        if (!name || !data) {
            return res.status(400).json({ error: "Nom et données du tableau requis !" });
        }

        const filePath = path.join(storagePath, `${name}.json`);
        await fs.writeJson(filePath, data, { spaces: 2 });

        res.json({ message: "✅ Tableau sauvegardé !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la sauvegarde." });
    }
});

// 📌 2. Charger un tableau existant
router.get('/load/:name', async (req, res) => {
    try {
        const filePath = path.join(storagePath, `${req.params.name}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Tableau non trouvé." });
        }

        const data = await fs.readJson(filePath);
        res.json({ name: req.params.name, data });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du chargement du tableau." });
    }
});

// 📌 3. Lister tous les tableaux enregistrés
router.get('/list', async (req, res) => {
    try {
        const files = await fs.readdir(storagePath);
        const tables = files.map(file => file.replace('.json', ''));
        res.json({ tableaux: tables });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des tableaux." });
    }
});

module.exports = router;
