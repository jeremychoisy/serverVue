const controller = require('./controller');
const express = require('express');
const router = express.Router();

// GET
router.get('/', controller.getListOfRestaurants);
router.get('/:id', controller.getRestaurantById);

// POST
router.post('/create', controller.addRestaurant);
router.post('/create-menu/:id', controller.createMenu);
router.post('/add-dish-to-global-menu/:id', controller.addDishToTheGlobalMenu);
router.post('/add-dish-to-specific-menu/:id/:menu', controller.addDishToSpecificMenu);

// DELETE
router.delete('/delete/:id', controller.deleteRestaurantById);
router.delete('/delete-specific-menu/:id/:menu', controller.deleteMenuById);
router.delete('/delete-dish-from-global-menu/:id/:dish', controller.deleteDishFromGlobalMenuById);
router.delete('/delete-dish-from-specific-menu/:id/:menu/:type/:dish', controller.deleteDishFromSpecificMenuById);

// PATCH
router.patch('/update/:id', controller.updateRestaurantById);
router.patch('/reset-global-menu/:id', controller.resetGlobalMenuById);
router.patch('/update-specific-menu/:id/:menu', controller.updateMenuById);
router.patch('/update-dish-in-global-menu/:id/:dish', controller.updateDishInGlobalMenuById);
router.patch('/update-dish-in-specific-menu/:id/:menu/:type/:dish', controller.updateDishInSpecificMenuById);

module.exports = router;
