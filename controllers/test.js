const Cube = require('../models/cube');

const cube = new Cube('Cube', 'itsa cube brahz', 'hhtp://something.com', 3);
const cube2 = new Cube('Cube2', 'second cube', 'http://', 2)
cube.saveCuve();
setTimeout(() => {
    cube2.saveCuve()
}, 3000)