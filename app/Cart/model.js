const restaurantModels = require("../Restaurant/model");

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    dishes : {type: [restaurantModels.dish]},
    menus : {type: [restaurantModels.menu]},
    totalPrice: {type: Number},
});

module.exports = mongoose.model('Cart', cartSchema);
