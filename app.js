// import express from 'express';
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const bodyParser = require('body-parser'); 

// routes
const authRoutes = require('./routes/api/auth');
const userRoutes = require('./routes/api/users')


const app = express();

// CORS Middleware
app.use(cors());

// Bodyparser Middleware
app.use(bodyParser.json());
// or we can use app.use(express.urlencoded({extented: true}))

// DB Config

mongoose
    .connect( `mongodb://localhost/demoTesting`,{
        useUnifiedTopology:true,
        useNewUrlParser:true,
        useCreateIndex:true,
    })
    .then(()=> console.log('MongoDB connected....'))
    .catch((err) => console.log(err));
const db =mongoose.connection;
db.on('error',console.error.bind(console,'error in connecting to Mongodb'));

db.once('open',function(){
    console.log('Connected to Database:: Mongodb');
});



// Use Routes

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);



module.exports = app;
