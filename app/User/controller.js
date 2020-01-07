const bcrypt = require('bcrypt');
const mongoose = require( "mongoose" );
const jwt = require('jsonwebtoken');
const key = require('../../config/jwtKeys');
const formidable = require('formidable');
const formHelper = require('../helpers/formSetup');
const passport = require('passport');


const User = mongoose.model( "User" );

const BCRYPT_SALT_ROUNDS = 10;

exports.signUp = async (req, res) => {
    try {
        const form = new formidable.IncomingForm(), data = {};
        formHelper.formSetup(form, data);
        form.on('error', function (err) {
            res.status(400).json({
                message: err.toString()
            });
        });
        form.on('end', async () => {
            const user = await User.findOne({$or:[{username: data.username},{email: data.email}]});
            if (user) {
                res.status(409).json({
                    message: 'User already exists.'
                });
            } else {
                data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
                const user = await User.create(data);

                for(let prop in user) if(user.hasOwnProperty(prop) && prop === 'password') delete user[prop];

                res.status(200).json({
                    user: user
                });
            }
        });
        form.parse(req);
    } catch ( err ){
        res.status(500).json({
            message: err.toString()
        });
    }
};

exports.logIn =  (req, res) => {
    try {
        passport.authenticate('login', {session: false}, (err, user, info) => {
            if (err || !user) {
                return res.status(info.code).json({
                    message: info ? info.message : 'Login failed',
                });
            }
            req.logIn(user, {session: false}, async (err) => {
                if (err) {
                    throw err.toString();
                }
                const token = jwt.sign({username: user.username, admin: user.rank === 'admin'}, key.secretKey);
                const foundUser = await User.findOne(req.body.username.indexOf('@') === -1 ? {username: req.body.username} : {email: req.body.username})
                    .select('username creationDate order rank')
                    .populate({path: 'orders', options: {sort: {creationDate: -1}}});
                res.status(200).json({
                    user: foundUser,
                    token: token
                });
            })
        })
        (req, res);
    } catch (err) {
        res.status(500).json({
            message: err.toString()
        });
    }
};
