const mongoose = require('mongoose');

const dish = new mongoose.Schema({
    name: {type: String},
    type: {type: String, enum: ['starter','main_course','dessert']},
    ingredients: {type: [String]},
    price: {type: Number},
    picture: {type: String}
});

const menu = new mongoose.Schema({
    name: {type: String},
    price: {type: Number},
    starters: {type: [dish]},
    main_courses: {type: [dish]},
    desserts: {type: [dish]}
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
            score: {type: Number}
        }]},
    menus: {type: [menu]},
    menu: {type: [dish]}
});

restaurantSchema.index({name: 1});

module.exports = {
    restaurant: mongoose.model('Restaurant', restaurantSchema),
    dish: dish,
    menu: menu
};
