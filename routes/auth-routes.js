const express = require('express');
const router = express.Router();
const { registerUser, verifyUserInfo } = require('../controllers/user-actions');
const { guestAccess } = require('../controllers/user-actions');

router.get('/login', guestAccess, (req, res) => {
    res.render('loginPage');
});
router.post('/login', guestAccess, async (req, res) => {
    const status = await verifyUserInfo(req, res);
    if (status) {
        res.redirect('/');
    } else {
        res.redirect('/login');
    } 
    
    
})

router.get('/register', guestAccess, (req, res) => {
    res.render('registerPage')
});
router.post('/register', guestAccess, async (req, res) => {
    const status = await registerUser(req, res);
});

module.exports = router;