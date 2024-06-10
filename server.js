const express = require("express");
const dbconnect = require("./database/index");
const { PORT } = require("./config");
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use(router);

dbconnect();

app.use(errorHandler);

app.get("/", (req, res) => res.json({ msg: "Hello world nodemon hi 2" }));

app.listen(PORT, () => console.log(`Backend is running on port: ${PORT}`));
