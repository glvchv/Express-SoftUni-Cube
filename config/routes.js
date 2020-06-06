const fs = require('fs');
const path = require('path');
const { getAllCubes, createCube, getCubeById } = require('../controllers/cube-actions');
const Cube = require('../models/cube');

module.exports = (app) => {
    app.get('/', (req, res) => {
        
        const cubes =  getAllCubes();
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
        createCube(req.body)
        res.redirect('/');
    });

    app.get('/details/:id', (req, res) => {
        const cube = getCubeById(req.params.id);
        res.render('details', {
            title: 'Cube Details',
            ...cube
        });
    });

    app.get('/about', (req, res) => {
        res.render('about', {
            title: 'About'
        });
    });

    app.get('*', (req, res) => {
        res.render('404', {
            title: 'Not Found'
        });
    })
};