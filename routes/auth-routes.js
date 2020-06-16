const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('loginPage');
});

router.get('/register', (req, res) => {
    res.render('registerPage')
});

module.exports = router;