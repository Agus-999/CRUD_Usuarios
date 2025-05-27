// index.js
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // Para parsear JSON

let usuarios = [];
let nextId = 1;

// GET /usuarios - Devuelve todos los usuarios
app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

// GET /usuarios/:id - Devuelve un usuario por ID
app.get("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(usuario);
});

// POST /usuarios - Crea un nuevo usuario
app.post("/usuarios", (req, res) => {
  const { nombre, email, edad } = req.body;

  if (!nombre || !email || !edad) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // Validar email único
  const emailExiste = usuarios.find(u => u.email === email);
  if (emailExiste) {
    return res.status(400).json({ error: "El email ya está registrado" });
  }

  const nuevoUsuario = {
    id: nextId++,
    nombre,
    email,
    edad
  };

  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// PUT /usuarios/:id - Actualiza un usuario
app.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const { nombre, email, edad } = req.body;

  if (!nombre || !email || !edad) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // Validar email duplicado (excepto el del mismo usuario)
  const emailEnUso = usuarios.find(u => u.email === email && u.id !== id);
  if (emailEnUso) {
    return res.status(400).json({ error: "El email ya está en uso por otro usuario" });
  }

  usuario.nombre = nombre;
  usuario.email = email;
  usuario.edad = edad;

  res.json(usuario);
});

// DELETE /usuarios/:id - Elimina un usuario
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  usuarios = usuarios.filter(u => u.id !== id);

  res.json({ mensaje: `Usuario con ID ${id} eliminado correctamente.` });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
