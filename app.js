const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./routes/users");
const cryptoRouter = require("./routes/crypto");

dotenv.config();
const app = express();
app.disable("x-powered-by");

//Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/", userRouter.router);
app.use("/", cryptoRouter.router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`A NodeJS API is listening on port ${port}`);
});
