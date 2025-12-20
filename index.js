const path = require('path');
const express = require('express');
const methodOverride = require('method-override') // for update data
const mongoose = require('mongoose');
const app = express();

// models
const Product = require('./models/product');
const Garment = require('./models/garment');

mongoose.connect('mongodb://127.0.0.1/shop_db').then(() => {
  console.log('connected to database');
}).catch(() => {
  console.log('connection failed');
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // for update data

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err))
    }
}

app.get('/', (req, res) => {
  res.send('halo tod');
});

app.get('/garments', wrapAsync( async (req, res) => {
  const garments = await Garment.find({});
  res.render('garments/index', { garments });
}));

app.get('/garments/create', (req, res) => { //  create
  res.render('garments/create')
})

app.post('/garments', wrapAsync(async (req, res) => { // store
    const garment = new Garment(req.body)
    await garment.save()
    res.redirect(`/garments`)
}))

app.get('/garments/:id', async (req, res) => { // show
  const garment = await Garment.findById(req.params.id);
  res.render('garments/show', { garment });
});

app.get('/garments/:garment_id/product/create', async (req, res) => {
  const garment_id = req.params.garment_id;
  res.render('products/create', { garment_id });
})

app.post('/garments/:garment_id/product', wrapAsync(async (req, res) => {
  const garment = await Garment.findById(req.params.garment_id);  
  const product = new Product(req.body);
  garment.products.push(product);
  await garment.save();
  await product.save();
  res.redirect(`/garments/${garment._id}`);
}))

app.get('/products/create', (req, res) => { //  create
  res.render('products/create')
})

app.get('/products', async (req, res) => {
  const category = req.query.category;
  if (category) {
    const products = await Product.find({ category });
    res.render('products/index', { products, category });
  }else{
    const products = await Product.find({});
    res.render('products/index', { products, category: 'All' });
  }
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

app.get('/products/:id/edit', async (req, res) => { // edit
  const product = await Product.findById(req.params.id);
  res.render('products/edit', { product });
});

app.put('/products/:id', async (req, res) => { // edit
  const product = await Product.findByIdAndUpdate(req.params.id, req.body , { runValidators: true, new: true });
  res.redirect(`/products/${product._id}`);
});

app.delete('/products/:id', async (req, res) => { // edit
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});

app.listen(3000, () => {
  console.log('shop app is running on port 3000');
});