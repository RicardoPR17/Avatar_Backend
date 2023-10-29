const axios = require("axios");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

client
  .connect()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

const database = client.db("Avatar");

const cryptosDoc = database.collection("Cryptos");

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

    // console.log("Top 10 Cryptocurrencies:");
    top10Criptocurrencies.forEach((cripto, index) => {
      // console.log(`${index + 1}. ${cripto.name} (${cripto.symbol}): $${cripto.current_price}`);
      result.cryptocurrencies.push({ name: cripto.name, value: cripto.current_price });
    });
    // console.log(result);
    await cryptosDoc.insertOne(result);
  } catch (error) {
    console.error("Error getting the top 10 cryptocurrencies:", error.message);
  }
};

const getCryptoData = async (req, res) => {
  const query = await cryptosDoc.find({}).sort({ date: -1 }).toArray();
  res.json(query);
};

const getOneCrypto = async (req, res) => {
  const cryptoName = req.params.name;
  try {
    const query = await cryptosDoc
      .find({ "cryptocurrencies.name": cryptoName })
      .project({ _id: 0, date: 1, "cryptocurrencies.$": 1 })
      .sort({ date: -1 })
      .toArray();
    if (query.length === 0) throw "Cryptocurrency not found";
    res.json(query);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

const getLastCryptoData = async (req, res) => {
  try {
    const query = await cryptosDoc
      .find({})
      .project({ _id: 0, date: 1, cryptocurrencies: 1 })
      .sort({ date: -1 })
      .limit(1)
      .toArray();
    res.json(query);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = { getCryptoData, getOneCrypto, getLastCryptoData };

setInterval(uploadTop10Cryptocurrencies, 900000); // Get cryptocurrencies price every 15min = 9000000ms
