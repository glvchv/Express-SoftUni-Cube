const env = process.env.NODE_ENV || 'development';

const express = require('express');
const Cube = require('../models/cube');
const jwt = require('jsonwebtoken');
const config = require('../config/config')[env];

const {
    getCubeById,
    searchCube,
    getCubeWithAccessories,
    updateCube,
    editCube
} = require('../controllers/cube-actions');
const {
    getAccessoryById,
    attachAccessoryToCube,
    showAvailableAccessories
} = require('../controllers/accessory-actions');
const { authAccess, checkUserStatus, checkIfAuth } = require('../controllers/user-actions');

const router = express.Router();


router.get('/create', authAccess, checkUserStatus, (req, res) => {
    res.render('create', {
        title: 'Cubicle | Create Cube',
        isLogged: req.isLogged
    });
});

router.post('/create', authAccess, (req, res) => {
    const {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body;
    const token = req.cookies['aid'];
    
    const decodedObj = jwt.verify(token, config.privateKey);

    const cube = new Cube({
        name,
        description,
        imageUrl,
        difficulty: difficultyLevel,
        creatorId: decodedObj.userId
    });
    cube.save((err) => {
        if (err) {
            console.error(err);
            res.redirect('/create');
        }
        res.redirect('/');
    })

});

router.get('/details/:id', checkUserStatus, checkIfAuth, async (req, res) => {
    const cube = await getCubeById(req.params.id);
    const accessoriesIds = cube.accessories;
    const accessoriesObjects = [];

    for await (let acc of accessoriesIds) {
        accessoriesObjects.push(await getAccessoryById(acc));
    };

    cube.accessories = accessoriesObjects;

    res.render('details', {
        title: 'Cubicle | Cube Details',
        ...cube,
        isLogged: req.isLogged,
        isAuth: req.isAuth
    });
});

router.post('/search', checkUserStatus, async (req, res) => {
    const {
        search,
        from,
        to
    } = req.body;
    const cubes = await searchCube(search, from, to);
    res.render('index', {
        cubes,
        isLogged: req.isLogged
    })

});

router.get('/attach/accessory/:id', authAccess, checkUserStatus, async (req, res) => {
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
        availableAccessories,
        isLogged: req.isLogged
    })
});

router.post('/attach/accessory/:id', authAccess, checkUserStatus, async (req, res) => {
    const cubeId = req.params.id;

    await updateCube(cubeId, req.body.accessory);
    await attachAccessoryToCube(req.body.accessory, cubeId);

    res.redirect(`/details/${cubeId}`)
});

router.get('/edit/:id', checkUserStatus, async (req, res) => {
    const cube = await Cube.findById(req.params.id).lean();

    res.render('editCubePage', {
        isLogged: req.isLogged,
        ...cube
    });
});
router.post('/edit/:id', async (req, res) => {
    await editCube(req.params.id, req.body);
    res.redirect(`/details/${req.params.id}`);
})

router.get('/delete/:id', checkUserStatus, async (req, res) => {
    const cube = await Cube.findById(req.params.id).lean();
    const {difficulty} = cube;
    const values = {
        1: '1 - Very Easy',
        2: '2 - Easy',
        3: '3 - Medium (Standard 3x3)',
        4: '4 - Intermediate',
        5: '5 - Expert',
        6: '6 - Hardcore'
    };

    res.render('deleteCubePage', {
        ...cube,
        isLogged: req.isLogged,
        value: values[difficulty]
    });
});
router.post('/delete/:id', async (req, res) => {
    await Cube.deleteOne({"_id": req.params.id});
    res.redirect('/');
});

module.exports = router;