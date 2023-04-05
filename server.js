const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const router = require('./routes/api/routes');


const { connectDatabase } = require('./service/database');
connectDatabase();

app.use(express.json());
app.use(cors());
app.use('/api/', router);

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
  
module.exports = app;
