const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

client
  .connect()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

const database = client.db("Avatar");

const offersDoc = database.collection("Offers");

// The user must be able to see ALL the available offers on the platform.
const getAllOffers = async (req, res) => {
  const query = await offersDoc
    .find({ state: "Open" })
    .project({ _id: 0, buyer: 0 })
    .toArray();
  res.status(200).json(query);
};

// The user must be able to search the offers filtered by the email of the seller
const getSellerOffers = async (req, res) => {
  const emailToSearch = req.params.email;
  try {
    if (!emailToSearch) throw new Error("Send an email to search the seller's offers");

    const regexEmail = new RegExp(`^${emailToSearch}`, "i");

    const offers = await offersDoc
      .find({ seller: { $regex: regexEmail } })
      .project({ _id: 0 })
      .toArray();

    if (offers.length === 0) throw new Error("Offers not found");
    res.send(offers);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

// The user must be able to search the offers filtered by his email as a buyer
const getBuyerOffers = async (req, res) => {
  const emailToSearch = req.params.email;
  try {
    if (!emailToSearch) throw new Error("Send an email to search the buyer's offers");

    const regexEmail = new RegExp(`^${emailToSearch}`, "i");

    const offers = await offersDoc
      .find({ buyer: { $regex: regexEmail } })
      .project({ _id: 0 })
      .toArray();

    if (offers.length === 0) throw new Error("Offers not found");
    res.send(offers);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// The user must be able to search the offers filtered by the cryptocurrencies
const getOffersByCrypto = async (req, res) => {
  const cryptoName = req.params.crypto;
  const cryptoSearch = new RegExp(`${cryptoName}`, "i"); // Regexp non case sensitive to search the crypto by his name
  try {
    const query = await offersDoc
      .find({ cryptocurrency: cryptoSearch, state: "Open" })
      .project({ _id: 0 })
      .toArray();
    if (query.length === 0) throw new Error("Cryptocurrency not found in offers");
    res.json(query);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { getAllOffers, getOffersByCrypto };
