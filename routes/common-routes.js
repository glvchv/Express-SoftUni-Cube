const express = require('express');
const {
    getAllCubes
} = require('../controllers/cube-actions');
const router = express.Router();

router.get('/', async (req, res) => {

    const cubes = await getAllCubes();
    res.render('index', {
        title: 'Cubicle | Browse',
        cubes
    });
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'Cubicle | About'
    });
});

module.exports = router;