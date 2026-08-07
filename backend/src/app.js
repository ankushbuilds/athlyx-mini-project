const express = require('express');

const app = express(); // creating an instance of express server


//middleware
app.use(express.json());



module.exports = app;