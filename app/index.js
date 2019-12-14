const restaurantRouter = require('./Restaurant/router');
const userRouter = require('./User/router');

module.exports = (app) => {
    app.use('/api/restaurants', restaurantRouter);
    app.use('/api/user', userRouter);
};
