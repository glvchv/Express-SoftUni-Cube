const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const privateKey = 'CUBICLE_WORKSHOP';

const generateJWT = (userId, username) => {
    const token = jwt.sign({userId, username}, privateKey);
    return token;
}

const registerUser = async (req, res) => {
    const {
        username,
        password, 
        repeatPassword
    } = req.body;
    if (password !== repeatPassword) {
        throw new Error('Passwords do not match!');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        password: hashedPassword
    });

    const userInfo = await user.save();
    
    const token = generateJWT(userInfo._id, username);
    res.cookie('aid', token);
    res.redirect('/');
};

const verifyUserInfo = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        username
    });

    if (!user) {
        console.log('No such user registered!');
    };
    const status = await bcrypt.compare(password, user.password);
    if (!status) {
        console.log('Invalid password!');
    };

    const token = generateJWT(user._id, username);
    res.cookie('aid', token);
    return status;
}

module.exports = {
    registerUser,
    verifyUserInfo
};