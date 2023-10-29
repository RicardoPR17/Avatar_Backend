const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Select the database and collection
    const database = client.db("Avatar");
    const collection = database.collection("Users");

    // Query the collection for documents
    const result = await collection.find({}).toArray();
    console.log("Result:", result);

    // const idQuery = await collection.findOne({ name: "Bitcoin" });
    // console.log(`Bitcoin document: ${JSON.stringify(idQuery)}`);
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
    console.log("Bye bye");
  }
}

run().catch(console.error());
