const express = require('express')
const cors = require('cors')
const dotenv = require("dotenv");
dotenv.config();

const contactsRouter = require('./routes/api/contacts')
const { connectDatabase } = require("./service/database");
connectDatabase();

const app = express()
app.use(express.json())
app.use(cors())

 app.use('/api/contacts', contactsRouter)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`)
});
  
module.exports = app;
