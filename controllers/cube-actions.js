const Cube = require('../models/cube');

const getAllCubes = async () => {
    try {
        const cubes = await Cube.find().lean();
        return cubes;
    } catch (err) {
        return err;
    }
};

const getCubeById = async (id) => {
    try {
        const currentCube = await Cube.findById(id).lean();
        return currentCube;
    } catch (err) {
        return err;
    }
};

const searchCube = async (search, from, to) => {
    try {
        const allCubes = await getAllCubes();
        if (from === '' & to === '') {
            from = 1;
            to = 6;
        }
        const cubesFound = allCubes.filter(cube => {
            return cube.name.toLowerCase().includes(search) && cube.difficulty >= from &&
                cube.difficulty <= to
        });
        return cubesFound;
    } catch (err) {
        return err;
    }
};

const updateCube = async (cubeId, accessoryId) => {
    try {
        return await Cube.findByIdAndUpdate(cubeId, {
            $addToSet: {
                accessories: [accessoryId]
            }
        }, {
            useFindAndModify: false
        });
    } catch (err) {
        return err;
    }
};

const getCubeWithAccessories = async (id) => {
    try {
        return await Cube.findById(id).populate('accessories').lean();
    } catch (err) {
        return err;
    }
};

const editCube = async (cubeId, cubeObject) => {
    const {
        name,
        difficultyLevel,
        imageUrl,
        description
    } = cubeObject;

    const newCube = {
        name,
        description,
        difficulty: difficultyLevel,
        imageUrl
    };
    try {
        await Cube.findByIdAndUpdate(cubeId, {
            $set: newCube
        }, {
            useFindAndModify: false
        });
    } catch (err) {
        return err;
    }
};

module.exports = {
    getAllCubes,
    getCubeById,
    searchCube,
    updateCube,
    getCubeWithAccessories,
    editCube
}