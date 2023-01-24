const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", require("./src/routes"));
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
