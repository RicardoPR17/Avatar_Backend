const offers = require("../controllers/offers");
const express = require("express");
const router = express.Router();

// Ruta GET: /api/offers
router.get("/db/offers", offers.getAllOffers);
router.get("/db/offers/seller/:email", offers.getSellerOffers);
router.get("/db/offers/buyer/:email", offers.getBuyerOffers);
router.get("/db/offers/:crypto", offers.getOffersByCrypto);

module.exports = { router };
