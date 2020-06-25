const express = require('express');
const router = express.Router();
const { registerUser, verifyUserInfo, logoutUser } = require('../controllers/user-actions');
const { guestAccess } = require('../controllers/user-actions');

router.get('/login', guestAccess, (req, res) => {
    res.render('loginPage');
});
router.post('/login', guestAccess, async (req, res) => {
    const { error, message } = await verifyUserInfo(req, res);
    if (error) {
        return res.render('loginPage', {
            title: 'Cubicle | Login',
            error: message,
        });
    };
    res.redirect('/');
})

router.get('/register', guestAccess, (req, res) => {
    res.render('registerPage')
});
router.post('/register', guestAccess, async (req, res) => {
    if (!req.password || req.password.length < 8 || !req.password.match(/^[A-Za-z0-9]+$/)) {
        return res.render('registerPage', {
          error: 'Username or password is not valid'
        })
      };
    
    const { error, message } = await registerUser(req, res);
    if (error) {
        return res.render('registerPage', {
            title: 'Cubicle | Register',
            error: message
        });
    };
    res.render('/');
});

router.get('/logout', (req, res) => {
    logoutUser(req, res);
});

module.exports = router;