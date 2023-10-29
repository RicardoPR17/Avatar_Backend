const users = require("../controllers/users");
const express = require("express");
const router = express.Router();

// Ruta GET: /api/users
router.get("/db/users", users.getUsers);

// Ruta POST: /api/users
router.post("/db/users", users.postUser);

module.exports = { router };
