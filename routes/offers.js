const offers = require("../controllers/offers");
const express = require("express");
const router = express.Router();

// Ruta GET: /api/offers
router.get("/db/offers", offers.getAllOffers);
router.get("/db/offers/:email", offers.getSellerOffers)

module.exports = { router };