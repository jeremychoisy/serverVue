const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoDBConfig = require('./config/db').mongoDBConfig;
const passport = require('passport');
const morgan = require('morgan');


// Bootstrap models
require('./app/Cart/model');
require('./app/Restaurant/model');
require('./app/User/model');

require('./passport-auth');


mongoose.set('useFindAndModify', false);


const server = express();
const port = 5000;

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(morgan("dev"));
server.use(passport.initialize());


server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
    next();
});

server.use('/restaurant-pictures', express.static(__dirname + '/public/pictures/restaurant-pictures'));
server.use('/dish-pictures', express.static(__dirname + '/public/pictures/dish-pictures'));

mongoose.Promise = global.Promise;
 mongoose.connect(mongoDBConfig.url, {
     useNewUrlParser: true,
     useUnifiedTopology: true
 })
         .then(() => {
     console.log("Connection to database established!");
 }).catch(err => {
     console.log(err);
     console.log("Connection to database failed :" + err);
 process.exit();
 });
 
require("./app") (server);

server.use((req,res)=> {
    res.sendStatus(404);
});

server.listen(port, () => {
        console.log("Server is running and listening on port " + port);
});
