const cryptos = require("../controllers/crypto");
const express = require("express");
const router = express.Router();

// Ruta GET: /db/cryptos
router.get("/db/cryptos", cryptos.getCryptoData);

router.get("/db/cryptos_last", cryptos.getLastCryptoData);

// Ruta GET: /db/cryptos/:name
router.get("/db/cryptos/:name", cryptos.getOneCrypto);


module.exports = { router };
