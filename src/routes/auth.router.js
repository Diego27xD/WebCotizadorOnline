const { Router } = require("express");
const {
  registrarUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");

const routerUser = Router();

routerUser.post("/api/v1/auth/register", registrarUser);
routerUser.post("/api/v1/auth/login", loginUser);
routerUser.get("/api/v1/auth/logout", logoutUser);
module.exports = { routerUser };
