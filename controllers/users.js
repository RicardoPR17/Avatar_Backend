const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

client
  .connect()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

const database = client.db("Avatar");

const usersDoc = database.collection("Users");
const offersDoc = database.collection("Offers");

const getUsers = async (req, res) => {
  const result = await usersDoc.find({}).toArray();
  res.status(200).json(result);
};

const postUser = async (req, res) => {
  try {
    const reqData = req.body;
    console.log(reqData.length === 0);
    console.log(!('email' in reqData));
    
    if (reqData.length === 0 || !('email' in reqData)) throw "Invalid data";
    reqData.wallet = [];
    reqData.balance = 0;
    console.log(reqData);
    const newAdded = await usersDoc.insertOne(reqData);

    res.status(201).json(newAdded);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

module.exports = { getUsers, postUser };
