const users = require("../controllers/users");
const express = require("express");
const router = express.Router();

// Rutas GET:
router.get("/db/users", users.getUsers);
router.get("/db/user/:email?", users.getAnUser);
router.get("/db/user/:email/balance", users.getUserBalance);

// Rutas POST:
router.post("/db/user", users.postUser);

module.exports = { router };