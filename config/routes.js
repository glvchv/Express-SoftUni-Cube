const fs = require('fs');
const path = require('path');
const {
    getAllCubes,
    getCubeById,
    searchCube
} = require('../controllers/cube-actions');
const Cube = require('../models/cube');

module.exports = (app) => {
    app.get('/', async (req, res) => {

        const cubes = await getAllCubes();
        res.render('index', {
            title: 'Browse Cubes',
            cubes
        });
    });

    app.get('/create', (req, res) => {
        res.render('create', {
            title: 'Create Cube'
        });
    });

    app.post('/create', (req, res) => {
        const {
            name,
            description,
            imageUrl,
            difficultyLevel
        } = req.body;
        console.log('THIS IS THE REQ>BODY: ', req.body);
        const cube = new Cube({
            name,
            description,
            imageUrl,
            difficulty: difficultyLevel
        });
        cube.save((err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('/');
        })

    });
    app.get('/create/accessory', (req, res) => {
        res.render('createAccessory');
    });

    app.get('/details/:id', async (req, res) => {
        const cube = await getCubeById(req.params.id);
        console.log('DETAILS CUbE = ', cube);

        res.render('detailsPage', {
            title: 'Cube Details',
            ...cube
        });
    });
    app.post('/search', async (req, res) => {
        const {search, from, to} = req.body;
        const cubes = await searchCube(search, from, to);
        res.render('index', {
            cubes
        })

    })

    app.get('/about', (req, res) => {
        res.render('about', {
            title: 'About'
        });
    });

    app.get('*', (req, res) => {
        res.render('404', {
            title: 'Not Found'
        });
    });
};