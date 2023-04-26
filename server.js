const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require("path");
connectDB();
const server = express();
const { corsManager } = require("./middlewares/corsManager");
const port = process.env.PORT;

server.use(corsManager);
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/images", express.static(path.join(__dirname, "images")));

server.use("/api/books", require("./routes/books.routes"));
server.use("/api/auth", require("./routes/users.routes"));

server.listen(port, () => console.log("~> Serveur lancé sur le port " + port));
