const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// models
const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1/shop_db').then(() => {
  console.log('connected to database');
}).catch(() => {
  console.log('connection failed');
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.send('halo tod');
});

app.listen(3000, () => {
  console.log('shop app is running on port 3000');
});