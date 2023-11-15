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
  const query = await offersDoc.find({}).toArray();
  res.status(200).json(query);
};

// The user must be able to search the offers filtered by the name of the seller
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

module.exports = { getAllOffers, getSellerOffers };
