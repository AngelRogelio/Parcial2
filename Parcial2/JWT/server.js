const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = "clave_secreta_para_el_token";

app.use(express.json());

// Ruta para simular el inicio de sesión y obtener el token
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        const user = { username: username };
        const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token: token });
    }

    return res.status(401).json({ mensaje: "Credenciales incorrectas" });
});

// Middleware para validar el JWT antes de permitir el acceso
function verificarToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1]; 
        
        jwt.verify(token, SECRET_KEY, (err, authData) => {
            if (err) {
                return res.status(403).json({ mensaje: "Token inválido o expirado" });
            }
            req.user = authData;
            next(); 
        });
    } else {
        res.status(401).json({ mensaje: "Acceso denegado. Falta el token." });
    }
}

// Ruta protegida por el mecanismo JWT
app.get('/dashboard', verificarToken, (req, res) => {
    res.json({
        mensaje: "Acceso autorizado al Dashboard",
        usuario: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});