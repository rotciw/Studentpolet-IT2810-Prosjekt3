var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    Varenummer: String,
    Varenavn: String,
    Volum: String,
    Pris: String,
    Literpris: String,
    Varetype: String,
    Produktutvalg: String,
    Fylde: String,
    Friskhet: String,
    Garvestoffer: String,
    Bitterhet: String,
    Sodme: String,
    Smak: String,
    Land: String,
    Argang: String,
    Rastoff: String,
    Alkohol: String,
    Embalashetype: String,
    Vareurl: String,
  });

  module.exports = mongoose.model('product', ProductSchema);