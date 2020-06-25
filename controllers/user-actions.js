const env = process.env.NODE_ENV || 'development';

const User = require('../models/user');
const Cube = require('../models/cube');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config')[env];

const generateJWT = (userId, username) => {
    const token = jwt.sign({
        userId,
        username
    }, config.privateKey);
    return token;
}

const registerUser = async (req, res) => {
    const {
        username,
        password,
        repeatPassword
    } = req.body;

    if (password !== repeatPassword) {
        return {
            error: true,
            message: 'Passwords must be the same!'
        };
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        password: hashedPassword
    });
    try {
        const userInfo = await user.save();

        const token = generateJWT(userInfo._id, username);
        res.cookie('aid', token);
        res.redirect('/');
    } catch (err) {
        return {
            error: true,
            message: err
        };
    };
};

const verifyUserInfo = async (req, res) => {
    const {
        username,
        password
    } = req.body;
    try {
        const user = await User.findOne({
            username
        });

        if (!user) {
            return {
                error: true,
                message: 'No user registered with this username!'
            }
        };
        const status = await bcrypt.compare(password, user.password);

        if (!status) {
            return {
                error: true,
                message: 'Password or username incorrect!'
            };
        };

        const token = generateJWT(user._id, username);
        res.cookie('aid', token);
        return status;
    } catch (err) {
        return {
            error: true,
            message: err
        };
    };
};

const authAccess = (req, res, next) => {

    const token = req.cookies['aid'];
    if (!token) {
        return res.redirect('/login');
    }
    const userObject = jwt.verify(token, config.privateKey);

    if (userObject) {
        next()
    } else {
        res.redirect('/login');
    }

};

const guestAccess = (req, res, next) => {
    const token = req.cookies['aid'];
    if (token) {
        return res.redirect('/');
    } else {
        next();
    }
};

const checkUserStatus = (req, res, next) => {
    const token = req.cookies['aid'];
    if (!token) {
        req.isLogged = false;
    }

    try {
        jwt.verify(token, config.privateKey);
        req.isLogged = true;
    } catch (error) {
        req.isLogged = false;
    };

    next();
};

const checkIfAuth = async (req, res, next) => {
    try {
        const cube = await Cube.findById(req.params.id, );
        const token = req.cookies['aid'];
        const userObject = jwt.verify(token, config.privateKey);

        userObject.userId == cube.creatorId ? req.isAuth = true : req.isAuth = false;
        next();
    } catch (err) {
        return err;
    }

};

const logoutUser = (req, res) => {
    res.clearCookie('aid');
    res.redirect('/');
};

module.exports = {
    registerUser,
    verifyUserInfo,
    authAccess,
    guestAccess,
    checkUserStatus,
    logoutUser,
    checkIfAuth
};