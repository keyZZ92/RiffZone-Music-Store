const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta de login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  fs.readFile("./users.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error leyendo users.json:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parseando users.json:", parseError);
      return res.status(500).json({ error: "Error al procesar usuarios" });
    }

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      res.json({ user: { email: user.email, username: user.username } });
    } else {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
  });
});

// Ruta de registro
app.post("/api/register", (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  fs.readFile("./users.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error leyendo users.json:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parseando users.json:", parseError);
      return res.status(500).json({ error: "Error al procesar usuarios" });
    }

    if (users.some((u) => u.email === email)) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const newUser = { email, password, username };
    users.push(newUser);

    fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("Error guardando el nuevo usuario:", err);
        return res.status(500).json({ error: "No se pudo guardar el usuario" });
      }

      res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
