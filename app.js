const express = require("express");
const { router } = require("./src/routes/producto.router");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { routerCliente } = require("./src/routes/cliente.router");
const { routerCotizacion } = require("./src/routes/cotizacion.router");
const { routerUser } = require("./src/routes/auth.router");

dotenv.config;
const PORT = process.env.PORT;
const app = express();
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(router);
app.use(routerCliente);
app.use(routerCotizacion);
app.use(routerUser);
app.get("/", (req, res) => {
  res.render("index", { usuario: "Diego", rol: "Backend Architect" });
});

app.listen(PORT, () => console.log("Servidor corriendo en el puerto " + PORT));
