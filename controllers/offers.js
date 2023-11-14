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
    

module.exports = { getAllOffers };