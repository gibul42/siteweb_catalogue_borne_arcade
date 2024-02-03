const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // Définissez le dossier contenant vos fichiers statiques (HTML, CSS, etc.)

app.listen(port, () => {
    console.log(`Serveur web en cours d'exécution sur http://localhost:${port}`);
});
