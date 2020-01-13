const mongoose = require('mongoose');
const formidable = require('formidable');
const fileHelper = require('../helpers/deleteFile');
const formHelper = require('../helpers/formSetup');


const Restaurant = mongoose.model('Restaurant');

/*
 * GET routes
 */

exports.getListOfRestaurants = async (req, res) => {
    try {
        let query = {};
        if(req.query.q) {
            const regEx = {
                $regex: new RegExp('.*' + req.query.q + '.*'),
                $options: 'i'
            };
            query = {$or: [{name: regEx}, {borough: regEx}]};
        }
        const page = req.query.page || 1;
        const pageSize = req.query.pagesize || 10;
        const resultsCount = await Restaurant.countDocuments(query);
        const restaurants = await Restaurant.find(query)
            .sort({name: 1})
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));
        res.status(200).json({
            restaurants: restaurants,
            count: resultsCount
        });
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        res.status(200).json({
            restaurant: restaurant,
        });
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

/*
 * POST routes
 */

exports.addRestaurant = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data, 'restaurant-pictures');
        form.on('error', function(err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.on('end', async () => {
            const restaurant = await Restaurant.create(data);
            res.status(200).json({
                restaurant : restaurant
            });
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};


exports.createMenu = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data);
        form.on('end', async () => {
            const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, {$push: {menus: data}}, {new: true});
            res.status(200).json({
                restaurant: updatedRestaurant
            });
        });
        form.on('error', function(err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.addDishToSpecificMenu = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data, 'dish-pictures');
        form.on('error', function(err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.on('end', async () => {
            const update = {};
            update['menus.$.' + data.type] = data;
            const updatedRestaurant = await Restaurant.findOneAndUpdate({_id: req.params.id, 'menus._id': req.params.menu}, {$push: update}, {new: true});
            res.status(200).json({
                restaurant: updatedRestaurant
            });
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.addDishToTheGlobalMenu = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data, 'dish-pictures');
        form.on('error', function(err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.on('end', async () => {
            const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, {$push: {menu: data}}, {new: true});
            res.status(200).json({
                restaurant: updatedRestaurant
            });
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

/*
 * PATCH routes
 */

exports.updateRestaurantById = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data, 'restaurant-pictures');
        form.on('error', function(err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.on('end', async () => {
            if(data.picture) {
                const restaurant = await Restaurant.findOne({_id: req.params.id});
                fileHelper.deleteFile(restaurant.picture, 'restaurant-pictures');
            }
            const updatedRestaurant = await Restaurant.findOneAndUpdate({_id: req.params.id}, {$set: data}, {new: true});
            res.status(200).json({
                restaurant : updatedRestaurant
            });
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.updateMenuById = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data);
        form.on('error', function(err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.on('end', async () => {

            const update = {};
            Object.keys(data).forEach((key) => {
                update['menus.$.' + key] = data[key];
            });

            const updatedRestaurant = await Restaurant.findOneAndUpdate({_id: req.params.id, 'menus._id': req.params.menu}, {$set: update}, {new: true});
            res.status(200).json({
                restaurant: updatedRestaurant
            });
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.updateDishInSpecificMenuById = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data, 'dish-pictures');
        form.on('error', function(err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.on('end', async () => {
            const restaurant = await Restaurant.findOne({_id: req.params.id});
            const menu = restaurant.menus.filter((menu) => menu._id.toString() === req.params.menu).pop();
            const dish = menu[req.params.type].filter((dish) => dish._id.toString() === req.params.dish).pop();
            if(data.picture) {
                fileHelper.deleteFile(dish.picture, 'dish-pictures');
            }
            const update = {};
            const dishIndex = menu[req.params.type].findIndex((dish) => dish._id.toString() === req.params.dish);

            Object.keys(data).forEach((key) => {
                update['menus.$.' + req.params.type + '.' + dishIndex + '.' + key] = data[key];
            });

            const updatedRestaurant = await Restaurant.findOneAndUpdate({_id: req.params.id, 'menus._id': req.params.menu}, {$set: update}, {new: true});
            res.status(200).json({
                restaurant: updatedRestaurant
            });
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.updateDishInGlobalMenuById = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data, 'dish-pictures');
        form.on('error', function(err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.on('end', async () => {
            if(data.picture) {
                const restaurant = await Restaurant.findOne({_id: req.params.id});
                const dish = restaurant.menu.filter((dish) => dish._id.toString() === req.params.dish).pop();
                fileHelper.deleteFile(dish.picture, 'dish-pictures');
            }

            const update = {};

            Object.keys(data).forEach((key) => {
                update['menu.$.' + key] = data[key];
            });
            const updatedRestaurant = await Restaurant.findOneAndUpdate({_id: req.params.id, 'menu._id': req.params.dish}, {$set: update}, {new: true});
            res.status(200).json({
                restaurant: updatedRestaurant
            });
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

/*
 * DELETE routes
 */

exports.deleteRestaurantById = async (req, res) => {
    try {
        // Delete all the pictures (restaurant/menus/dished)
        const restaurant = await Restaurant.findOne({_id: req.params.id});
        if(restaurant.picture) {
            fileHelper.deleteFile(restaurant.picture, 'restaurant-pictures');
        }

        // Delete the restaurant document
        await restaurant.delete();
        res.status(200).json({
            message: 'success',
        });
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.resetGlobalMenuById = async (req, res) => {
    try {
        // Update the restaurant object by deleting the menu
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, {$set: {menu: []}},{new: true});
        res.status(200).json({
            restaurant: updatedRestaurant,
        });
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.deleteMenuById = async (req, res) => {
    try {
        // Update the restaurant object by deleting the menu
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, {$pull: {menus: {_id: req.params.menu}}},{new: true});
        res.status(200).json({
            restaurant: updatedRestaurant,
        });
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.deleteDishFromGlobalMenuById = async (req, res) => {
    try {
        // Update the restaurant object by deleting the dish from the global menu
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, {$pull: {menu: {_id: req.params.dish}}},{new: true});
        res.status(200).json({
            restaurant: updatedRestaurant,
        });
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.deleteDishFromSpecificMenuById = async (req, res) => {
    try {
        // Update the restaurant object by deleting the dish from the specific menu
        const update = {};
        update['menus.$.' + req.params.type] = { _id: req.params.dish};
        const updatedRestaurant = await Restaurant.findOneAndUpdate({_id: req.params.id, 'menus._id': req.params.menu}, {$pull: update}, {new: true});
        res.status(200).json({
            restaurant: updatedRestaurant,
        });
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

