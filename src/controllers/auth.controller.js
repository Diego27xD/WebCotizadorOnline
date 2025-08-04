const { prisma } = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userSchema, loginSchema } = require("../schemas/product.schema");

// Secret key for JWT (should be in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "djañsjdkasjdasdj1231";

// Función para registrar un nuevo usuario
const registrarUser = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // Verificar si el correo o el usuario ya existen
    const existingUser = await prisma.usuario.findFirst({
      where: {
        usuario: usuario,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        header: {
          ok: false,
          message: "El usuario ya está en uso",
          status: 400,
        },
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: {
        usuario: usuario,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      header: {
        ok: true,
        message: "Usuario registrado exitosamente",
        status: 201,
      },
      data: {
        usuario: newUser.usuario,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "Hubo un error en la operación",
        status: 500,
      },
    });
  }
};

// Función para iniciar sesión de usuario
const loginUser = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const user = await prisma.usuario.findFirst({ where: { usuario } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render("index", {
        error: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign({ userId: user.IdUser }, JWT_SECRET, {
      expiresIn: "3h",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    res.redirect("/home/clientes");
  } catch (error) {
    console.error(error.message);
    res.status(500).render("login", {
      error: "Hubo un error en la operación",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.redirect("/");
};

module.exports = { registrarUser, loginUser, logoutUser };
