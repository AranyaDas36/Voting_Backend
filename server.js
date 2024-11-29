const express = require('express');
const app = express();

const db = require('./db');

require('dotenv').config();

//app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req.body

const PORT = process.env.PORT || 4000;

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);




app.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`)
});
