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

const getAnUser = async (req, res) => {
  const emailToSearch = req.params.email;
  try {
    if (!emailToSearch) throw new Error("Send an email to search the user");

    const regexEmail = new RegExp(`^${emailToSearch}`, "i");

    const user = await usersDoc.find({ email: { $regex: regexEmail } }).toArray();

    if (user.length === 0) throw new Error("User not found");

    res.json(user);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

const postUser = async (req, res) => {
  try {
    const reqData = req.body;
    console.log(reqData.length === 0);
    console.log(!("email" in reqData));

    if (reqData.length === 0 || !("email" in reqData)) throw new Error("Invalid data to add the user");
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

const getUserWallet = async (req, res) => {
  const emailToSearch = req.params.email;
  try {
    if (!emailToSearch) throw new Error("Send an email to search the user's wallet");

    const regexEmail = new RegExp(`^${emailToSearch}`, "i");

    const user = await usersDoc
      .find({ email: { $regex: regexEmail } })
      .project({ email: 0 })
      .toArray();

    if (user.length === 0) throw new Error("User not found");

    res.json(user);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

module.exports = { getUsers, postUser, getAnUser, getUserWallet };
