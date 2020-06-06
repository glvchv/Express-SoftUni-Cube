const Cube = require('../models/cube');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', '/config/database.json');

function getAllCubes() {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data)
};

function createCube(data) {
    const allCubes = getAllCubes();

    const { name, description, imageUrl, difficultyLevel } = data;
    const newCube = new Cube(name, description, imageUrl, difficultyLevel);
    allCubes.push(newCube);

    fs.writeFileSync(dbPath, JSON.stringify(allCubes));
    console.log('Successfuly added a cube!');
};

function getCubeById(id) {
    const allCubes = getAllCubes();
    const currentCube = allCubes.find(cube => cube.id === id);
    return currentCube;
}

module.exports = {
    getAllCubes,
    createCube,
    getCubeById
}