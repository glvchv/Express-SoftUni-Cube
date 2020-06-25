const express = require('express');
const Accessory = require('../models/accessory');
const router = express.Router();
const {
    authAccess,
    checkUserStatus
} = require('../controllers/user-actions');


router.get('/create/accessory', authAccess, checkUserStatus, (req, res) => {
    res.render('createAccessory', {
        title: 'Cubicle | Add Accessory',
        isLogged: req.isLogged
    });
});

router.post('/create/accessory', authAccess, async (req, res) => {
    const {
        name,
        imageUrl,
        description
    } = req.body;
    const accessory = new Accessory({
        name,
        imageUrl,
        description
    });

    try {
        await accessory.save();
        res.render('createAccessory', {
            title: 'Cubicle | Create Accessory',
            isLogged: req.isLogged
        });
    } catch (err) {
        res.render('createAccessory', {
            title: 'Cubicle | Create Accessory',
            isLogged: req.isLogged,
            error: 'Accessory\'s input is not valid!'
        });
    };
});

module.exports = router;