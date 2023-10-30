const users = require("../controllers/users");
const express = require("express");
const router = express.Router();

// Ruta GET: /api/users
router.get("/db/users", users.getUsers);

router.get("/db/user/:email", users.getAnUser);

// Ruta POST: /api/users
router.post("/db/user", users.postUser);

module.exports = { router };
