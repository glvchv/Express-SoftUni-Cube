const express = require('express');
const {
    getAllCubes
} = require('../controllers/cube-actions');
const { checkUserStatus } = require('../controllers/user-actions');
const router = express.Router();

router.get('/', checkUserStatus, async (req, res) => {

    const cubes = await getAllCubes();
    res.render('index', {
        title: 'Cubicle | Browse',
        cubes,
        isLogged: req.isLogged
    });
});

router.get('/about', checkUserStatus, (req, res) => {
    res.render('about', {
        title: 'Cubicle | About',
        isLogged: req.isLogged
    });
});

module.exports = router;