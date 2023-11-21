const offers = require("../controllers/offers");
const express = require("express");
const router = express.Router();

// Ruta GET: /api/offers
router.get("/db/offers", offers.getAllOffers);

module.exports = { router };
