const path = require('path');
const express = require('express');
const methodOverride = require('method-override')
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
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err))
    }
}

app.get('/', (req, res) => {
  res.send('halo tod');
});

app.get('/products/create', (req, res) => { //  create
  res.render('products/create')
})

app.get('/products', async (req, res) => {
  const products = await Product.find({});
  res.render('products/index', { products, category: 'All' });
});

app.post('/products', wrapAsync(async (req, res) => { // store
    const product = new Product(req.body)
    await product.save()
    res.redirect(`/products/${product._id}`)
}))

app.get('/products/:id', async (req, res) => { // show
  const product = await Product.findById(req.params.id);
  res.render('products/show', { product });
});

app.listen(3000, () => {
  console.log('shop app is running on port 3000');
});