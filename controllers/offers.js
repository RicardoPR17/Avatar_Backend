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
  const query = await offersDoc.find({ state: "Open" }).project({ _id: 0, buyer: 0 }).toArray();
  res.status(200).json(query);
};

// The user must be able to buy an offer and get the cryptos
const buyOffer = async (req, res) => {
  const reqData = req.body;
  try {
    if (reqData.length === 0 || !("offer" in reqData) || !("buyer" in reqData)) {
      res.status(400);
      throw new Error("Invalid data to buy an offer");
    }

    let offerData = await offersDoc.find({ offer_id: reqData.offer }).toArray();
    while (!offerData) {} // Wait until the offer to buy be obtain

    let offerState = offerData[0].state;
    if (offerState == "Closed") {
      res.status(410);
      throw new Error("Sorry, someone buy this offer");
    }

    const updatedOffer = await offersDoc.findOneAndUpdate(
      { offer_id: reqData.offer },
      { $set: { state: "Closed", buyer: reqData.buyer } },
      { returnOriginal: false }
    );
    while (!updatedOffer) {}
    let sellerEmail = offerData[0].seller;

    const usersDoc = database.collection("Users");
    const sellerUser = await usersDoc.find({ email: sellerEmail }).toArray();
    const buyerUser = await usersDoc.find({ email: reqData.buyer }).toArray();
    while (!sellerUser && !buyerUser) {} // Wait until get the users related to the transaction

    let cryptocurrency = offerData[0].cryptocurrency;
    let amount = offerData[0].amount;
    let sellerWallet = sellerUser[0].wallet;
    let sellerWalletUpdate = updateSellerWallet(sellerWallet, cryptocurrency, amount);
    let buyerWallet = buyerUser[0].wallet;
    let buyerWalletUpdate = updateBuyerWallet(buyerWallet, cryptocurrency, amount);

    const updatedSeller = await usersDoc.findOneAndUpdate(
      { email: sellerEmail },
      { $set: { wallet: sellerWalletUpdate } },
      { returnOriginal: false }
    );
    const updatedBuyer = await usersDoc.findOneAndUpdate(
      { email: reqData.buyer },
      { $set: { wallet: buyerWalletUpdate } },
      { returnOriginal: false }
    );

    while (!updatedSeller && !updatedBuyer) {}
    res.status(201).send({ message: "Transaction completed successfully!" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const updateSellerWallet = (sellerWallet, cryptocurrency, amount) => {
  let updated = sellerWallet;
  for (let i = 0; i < sellerWallet.length; i++) {
    if (sellerWallet[i].crypto == cryptocurrency) {
      updated[i].amount -= amount;
      if (updated[i].amount == 0) {
        updated.splice(i, 1);
      }
      break;
    }
  }
  return updated;
};

const updateBuyerWallet = (buyerWallet, cryptocurrency, amount) => {
  let updated = buyerWallet;
  // Check if the buyer has the cryptocurrency. If it does, add the amount. Otherwise, add this cryptocurrency to its wallet
  let cryptoFound = false;
  for (let i = 0; i < buyerWallet.length; i++) {
    if (buyerWallet[i].crypto == cryptocurrency) {
      updated[i].amount += amount;
      cryptoFound = true;
      break;
    }
  }

  if (!cryptoFound) {
    updated.push({ crypto: cryptocurrency, amount: amount });
  }
  return updated;
};

module.exports = { getAllOffers, buyOffer };