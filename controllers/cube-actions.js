const Cube = require('../models/cube');

const getAllCubes = async () => {

    const cubes = await Cube.find().lean();
    return cubes;
}

const getCubeById = async (id) => {
    const currentCube = await Cube.findById(id).lean();
    console.log('Actions = ', currentCube);
    return currentCube;
}

const searchCube = async (search, from, to) => {
    console.log(search, from, to);
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
}

module.exports = {
    getAllCubes,
    getCubeById,
    searchCube
}