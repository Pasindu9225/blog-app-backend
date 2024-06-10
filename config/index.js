const dotenv = require("dotenv").config();

const PORT = process.env.port || 5000; // Use default port 5000 if not specified
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

if (!MONGODB_CONNECTION_STRING) {
  throw new Error(
    "MONGODB_CONNECTION_STRING environment variable is not defined"
  );
}

module.exports = {
  PORT,
  MONGODB_CONNECTION_STRING,
};
