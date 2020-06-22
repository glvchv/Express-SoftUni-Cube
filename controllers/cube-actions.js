const Cube = require('../models/cube');

const getAllCubes = async () => {

    const cubes = await Cube.find().lean();
    return cubes;
};

const getCubeById = async (id) => {
    const currentCube = await Cube.findById(id).lean();
    return currentCube;
};

const searchCube = async (search, from, to) => {
    const allCubes = await getAllCubes();
    if (from === '' & to === '') {
        from = 1;
        to = 6;
    }
    const cubesFound = allCubes.filter(cube => {
        return cube.name.toLowerCase().includes(search) && cube.difficulty >= from
        && cube.difficulty <= to
    });
    return cubesFound;
};

const updateCube = async (cubeId, accessoryId) => {
    return await Cube.findByIdAndUpdate(cubeId, {
        $addToSet: {
            accessories: [accessoryId]
        }
    }, {useFindAndModify: false})
};

const getCubeWithAccessories = async (id) => {
    return await Cube.findById(id).populate('accessories').lean();
};

const editCube = async (cubeId, cubeObject) => {
    const { name, difficultyLevel, imageUrl, description} = cubeObject;

    const newCube = {
        name, description, difficulty: difficultyLevel, imageUrl
    };
    await Cube.findByIdAndUpdate(cubeId, {$set: newCube}, {useFindAndModify: false});
};

module.exports = {
    getAllCubes,
    getCubeById,
    searchCube,
    updateCube,
    getCubeWithAccessories,
    editCube
}