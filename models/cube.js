const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'config/database.json');

class Cube {
    constructor(name, description, imageUrl, difficulty) {
        this.id = uniqid();
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.difficulty = difficulty;
    }
}

module.exports = Cube;
