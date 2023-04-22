const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
connectDB();
const server = express();
const port = process.env.PORT;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/api/books", require("./routes/books.routes"));

server.listen(port, () => console.log("serveur lancé sur le port " + port));

// server.use((req, res, next) => {
// 	res.setHeader("Access-Control-Allow-Origin", "*");
// 	res.setHeader(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
// 	);
// 	res.setHeader(
// 		"Access-Control-Allow-Methods",
// 		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
// 	);
// 	next();
// });
