const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000
const path = require('path');

app.use(cors());
app.use(express.json());



const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const memoryRouter = require('./routes/memories');



app.use('/memories', memoryRouter);

app.use(express.static('../build'));
app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});