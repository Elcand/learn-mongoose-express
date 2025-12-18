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

app.get('/products', async (req, res) => {
  const products = await Product.find({});
  res.render('products', { products });
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('products/show', { product });
});

app.listen(3000, () => {
  console.log('shop app is running on port 3000');
});