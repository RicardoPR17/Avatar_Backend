const cryptos = require("../controllers/crypto");
const express = require("express");
const router = express.Router();

// Rutas GET:
router.get("/db/cryptos", cryptos.getCryptoData);
router.get("/db/cryptos_last", cryptos.getLastCryptoData);
router.get("/db/cryptos/:name", cryptos.getOneCrypto);


module.exports = { router };
