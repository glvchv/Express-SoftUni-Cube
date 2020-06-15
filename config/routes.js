const {
    getAllCubes,
    getCubeById,
    searchCube,
    updateCube,
    getCubeWithAccessories
} = require('../controllers/cube-actions');
const {
    getAccessoryById,
    attachAccessoryToCube,
    showAvailableAccessories
} = require('../controllers/accessory-actions');

const Cube = require('../models/cube');
const Accessory = require('../models/accessory');
const {
    get
} = require('mongoose');

module.exports = (app) => {
    app.get('/', async (req, res) => {

        const cubes = await getAllCubes();
        res.render('index', {
            title: 'Cubicle | Browse',
            cubes
        });
    });

    app.get('/create', (req, res) => {
        res.render('create', {
            title: 'Cubicle | Create Cube'
        });
    });

    app.post('/create', (req, res) => {
        const {
            name,
            description,
            imageUrl,
            difficultyLevel
        } = req.body;

        const cube = new Cube({
            name,
            description,
            imageUrl,
            difficulty: difficultyLevel
        });
        cube.save((err) => {
            if (err) {
                console.error(err);
                res.redirect('/create');
            }
            res.redirect('/');
        })

    });

    app.get('/create/accessory', (req, res) => {
        res.render('createAccessory', {
            title: 'Cubicle | Add Accessory'
        });
    });

    app.post('/create/accessory', (req, res) => {
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


    app.get('/details/:id', async (req, res) => {
        const cube = await getCubeById(req.params.id);
        const accessoriesIds = cube.accessories;
        const accessoriesObjects = [];
        for await (let acc of accessoriesIds) {
            accessoriesObjects.push(await getAccessoryById(acc))
        }
        cube.accessories = accessoriesObjects;
        res.render('details', {
            title: 'Cubicle | Cube Details',
            ...cube
        });
    });

    app.post('/search', async (req, res) => {
        const {
            search,
            from,
            to
        } = req.body;
        const cubes = await searchCube(search, from, to);
        res.render('index', {
            cubes
        })

    })

    app.get('/about', (req, res) => {
        res.render('about', {
            title: 'Cubicle | About'
        });
    });

    app.get('/attach/accessory/:id', async (req, res) => {
        const cube = await getCubeWithAccessories(req.params.id);
        let areNotAttachable = false;

        const availableAccessories = await showAvailableAccessories(req.params.id);
        if (cube.accessories.length === availableAccessories.length || availableAccessories.length < 1) {
            areNotAttachable = true;
        }
        res.render('attachAccessory', {
            title: 'Cubicle | Attach Accessory',
            ...cube,
            areNotAttachable,
            availableAccessories
        })
    });

    app.post('/attach/accessory/:id', async (req, res) => {
        const cubeId = req.params.id;
        
        await updateCube(cubeId, req.body.accessory);
        await attachAccessoryToCube(req.body.accessory, cubeId);
        
        res.redirect(`/details/${cubeId}`)
    });

    app.get('/login', (req, res) => {
        res.render('loginPage');
    });

    app.get('/register', (req, res) => {
        res.render('registerPage')
    })

    app.get('*', (req, res) => {
        res.render('404', {
            title: 'Cubicle | Page Not Found'
        });
    });
};