const mongoose = require('mongoose');

const garmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Name is required' ]
  },
  location: {
    type: String,
  },
  price: {
    type: Number,
    required: true
  },
  contact: {
    type: String,
    required: [true, 'Contact is required']
  },
  products: {
    type: [ mongoose.Schema.Types.ObjectId ],
    ref: 'Product'
  }
});

const Garment = mongoose.model('Garment', garmentSchema);

module.exports = Garment