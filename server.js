const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const PORT = 3000;
const contactsRouter = require('./routes/api/contacts');
dotenv.config();

const { connectDatabase } = require('./service/database');
connectDatabase();

app.use(express.json());
app.use(cors());
app.use('/api/contacts', contactsRouter);

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
  
module.exports = app;
