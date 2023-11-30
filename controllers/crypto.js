const axios = require("axios");
const socketIO = require("socket.io");
const { MongoClient } = require("mongodb");
const { validateAzureJWT } = require("./tokenValidator");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

client
  .connect()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

const database = client.db("Avatar");

const cryptosDoc = database.collection("Cryptos");

const io = new socketIO.Server(process.env.PORT_SOCKET, { cors: { origin: "*" } });

const uploadTop10Cryptocurrencies = async () => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd", // Puedes cambiar 'usd' a otra moneda si lo prefieres
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    });

    const top10Criptocurrencies = response.data;
    const result = { date: new Date(Date.now()).toISOString(), cryptocurrencies: [] };

    top10Criptocurrencies.forEach((cripto, index) => {
      result.cryptocurrencies.push({ name: cripto.name, value: cripto.current_price });
    });
    await cryptosDoc.insertOne(result);

    io.emit("data", [result]);
    console.log("emit");
  } catch (error) {
    console.error("Error getting the top 10 cryptocurrencies:", error.message);
  }
};

const getCryptoData = async (req, res) => {
  try {
    if (!validateAzureJWT(req)) {
      res.status(401);
      throw new Error("Invalid authorization");
    }
    const query = await cryptosDoc.find({}).sort({ date: -1 }).toArray();
    res.json(query);
  } catch (err) {
    res.json({ error: err.message });
  }
};

const getOneCrypto = async (req, res) => {
  try {
    if (!validateAzureJWT(req)) {
      res.status(401);
      throw new Error("Invalid authorization");
    }
    const cryptoName = req.params.name;
    const cryptoSearch = new RegExp(`${cryptoName}`, "i");
    const query = await cryptosDoc
      .find({ "cryptocurrencies.name": cryptoSearch })
      .project({ _id: 0, date: 1, "cryptocurrencies.$": 1 })
      .sort({ date: -1 })
      .limit(15)
      .toArray();
    if (query.length === 0) {
      res.status(404);
      throw new Error("Cryptocurrency not found");
    }
    res.json(query);
  } catch (err) {
    res.json({ error: err.message });
  }
};

const getLastCryptoData = async (req, res) => {
  try {
    if (!validateAzureJWT(req)) {
      res.status(401);
      throw new Error("Invalid authorization");
    }
    const query = await cryptosDoc
      .find({})
      .project({ _id: 0, date: 1, cryptocurrencies: 1 })
      .sort({ date: -1 })
      .limit(1)
      .toArray();
    res.json(query);
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = { getCryptoData, getOneCrypto, getLastCryptoData };

setInterval(uploadTop10Cryptocurrencies, 60000); // Get cryptocurrencies price every 1min = 60000ms
