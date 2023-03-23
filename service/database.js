const mongoose = require("mongoose");

const uriDb = process.env.DB_HOST;

const connectDatabase = async () => {
  await mongoose
    .connect(uriDb)
    .then(() => console.log("Database connection successful"))
    .catch((err) => console.log("Error to connect database" + err));
};

module.exports = { connectDatabase };
