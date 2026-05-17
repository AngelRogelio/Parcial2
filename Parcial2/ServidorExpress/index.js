const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/ejercicio', (req, res) => {
    
    if (!req.query.nombre) {
        return res.status(400).json({ 
            status: 400,
            message: "El parámetro 'nombre' es requerido"
        });
    }

    
    res.json({
        status: 200,
        message: `Servidor del Parcial 2 activo. Hola ${req.query.nombre}`
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}/api/ejercicio`);
});