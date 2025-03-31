// Cargar variables de entorno
require("dotenv").config();

// Importar módulos necesarios
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inicializar la aplicación Express
const app = express();

// Middleware
app.use(express.json()); // Parsear cuerpos de solicitud en formato JSON
app.use(cors()); // Habilitar CORS para permitir solicitudes desde diferentes orígenes

// Conectar a la base de datos MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Definir el esquema y modelo de Usuario
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Ruta para la página de inicio
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de autenticación");
});

// Ruta para registrar un nuevo usuario
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validar que se proporcionaron un nombre de usuario y una contraseña
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Se requieren nombre de usuario y contraseña" });
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "El nombre de usuario ya está en uso" });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear un nuevo usuario
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error registrando usuario" });
  }
});

// Ruta para iniciar sesión
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validar que se proporcionaron un nombre de usuario y una contraseña
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Se requieren nombre de usuario y contraseña" });
  }

  // Buscar al usuario en la base de datos
  const user = await User.findOne({ username });

  // Verificar si el usuario existe y si la contraseña es correcta
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }

  // Generar un token JWT
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Ruta protegida que requiere autenticación
app.get("/profile", (req, res) => {
  // Obtener el token del encabezado de autorización
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Se requiere autenticación" });
  }

  // Verificar y decodificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    res.json({ message: "Acceso al perfil concedido", user: decoded });
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
