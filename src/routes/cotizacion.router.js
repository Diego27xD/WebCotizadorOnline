const { Router } = require("express");
const {
  getCotizaciones,
  crearCotizaciones,
  actualizacionCotizaciones,
  eliminarCotizaciones,
  verDetalleCotizacion,
  downloadPDFCotizacion,
} = require("../controllers/cotizacion.controller");
const verifyToken = require("../middleware/verify");

const routerCotizacion = Router();

routerCotizacion.get("/home/cotizaciones", verifyToken, getCotizaciones);
routerCotizacion.post("/cotizacion/crear", verifyToken, crearCotizaciones);
routerCotizacion.post(
  "/cotizacion/actualizar",
  verifyToken,
  actualizacionCotizaciones
);
routerCotizacion.delete(
  "/cotizacion/eliminar/:id",
  verifyToken,
  eliminarCotizaciones
);
routerCotizacion.get("/cotizacion/view/:id", verifyToken, verDetalleCotizacion);
routerCotizacion.get(
  "/cotizacion/download/:IdCotizacion",
  downloadPDFCotizacion
);

module.exports = { routerCotizacion };
