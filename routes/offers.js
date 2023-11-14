const offers = require("../controllers/offers");
const express = require("express");
const router = express.Router();

// Ruta GET: /api/users
router.get("/db/offers", offers.getAllOffers);

module.exports = { router };