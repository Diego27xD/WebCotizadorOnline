const { Router } = require("express");
const {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} = require("../controllers/cliente.controller");
const verifyToken = require("../middleware/verify");

const routerCliente = Router();

routerCliente.get("/home/clientes", verifyToken, listarClientes);
routerCliente.post("/cliente/crear", verifyToken, crearCliente);
routerCliente.post("/cliente/actualizar", verifyToken, actualizarCliente);
routerCliente.delete("/cliente/eliminar/:id", verifyToken, eliminarCliente);

module.exports = { routerCliente };
