const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 📌 Middlewares
app.use(cors());
app.use(express.json());

// 📌 Définition des routes
const tableauRoutes = require('./routes/tableau');
app.use('/tableau', tableauRoutes);

// 📌 Route de test
app.get('/', (req, res) => {
    res.send('🚀 Serveur en cours de fonctionnement !');
});

// 📌 Lancer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours sur http://localhost:${PORT}`);
});
