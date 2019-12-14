const mongoose = require('mongoose');

const dish = new mongoose.Schema({
    name: {type: String},
    type: {type: String, enum: ['starter','main_course','dessert']},
    description: {type: String},
    price: {type: Number},
    picture: {type: String}
});

const menu = new mongoose.Schema({
    name: {type: String},
    price: {type: Number},
    starter: {type: [dish]},
    main_course: {type: [dish]},
    dessert: {type: [dish]}
});

const restaurantSchema = new mongoose.Schema({
    name : {type: String},
    borough : {type: String},
    picture: {type: String},
    address: {
        type: {
            building : {type: String},
            coord : {type: [Number]},
            street : {type: String},
            zipcode : {type: String}
        }},
    grades: {type: [{
            date: {type: Date, default: Date.now},
            grade: {type: String},
            score: {type: Number}
        }]},
    menus: {type: [menu]},
    menu: {type: [dish]}
});

module.exports = {
    restaurant: mongoose.model('Restaurant', restaurantSchema),
    dish: dish,
    menu: menu
};
