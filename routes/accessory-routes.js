const express = require('express');
const Accessory = require('../models/accessory');
const router = express.Router();
const { authAccess } = require('../controllers/user-actions');


router.get('/create/accessory', authAccess, (req, res) => {
    res.render('createAccessory', {
        title: 'Cubicle | Add Accessory'
    });
});

router.post('/create/accessory', authAccess, (req, res) => {
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
    accessory.save((err) => {
        if (err) {
            console.error(err);
        }
    })

    res.redirect('/create/accessory');
});

module.exports = router;