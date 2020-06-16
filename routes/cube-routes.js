const express = require('express');
const Cube = require('../models/cube');
const {
    getCubeById,
    searchCube,
    getCubeWithAccessories,
    updateCube
} = require('../controllers/cube-actions');
const {
    getAccessoryById,
    attachAccessoryToCube,
    showAvailableAccessories
} = require('../controllers/accessory-actions');

const router = express.Router();


router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Cubicle | Create Cube'
    });
});

router.post('/create', (req, res) => {
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

router.get('/details/:id', async (req, res) => {
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

router.post('/search', async (req, res) => {
    const {
        search,
        from,
        to
    } = req.body;
    const cubes = await searchCube(search, from, to);
    res.render('index', {
        cubes
    })

});

router.get('/attach/accessory/:id', async (req, res) => {
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

router.post('/attach/accessory/:id', async (req, res) => {
    const cubeId = req.params.id;

    await updateCube(cubeId, req.body.accessory);
    await attachAccessoryToCube(req.body.accessory, cubeId);

    res.redirect(`/details/${cubeId}`)
});

module.exports = router;