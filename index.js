require('dotenv').config();
const connect = require('./utils/db.js')();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`application is running on port ${process.env.PORT}`);
})