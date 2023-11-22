const offers = require("../controllers/offers");
const express = require("express");
const router = express.Router();

// Rutas GET:
router.get("/db/offers", offers.getAllOffers);

// Rutas POST:
router.post("/db/offers/buy", offers.buyOffer);

module.exports = { router };
