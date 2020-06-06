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
    saveCuve() {
        const currentCube = {
            id: this.id,
            name: this.name,
            description: this.description,
            imageUrl: this.imageUrl,
            difficulty: this.difficulty
        }
        fs.readFile(dbPath, (err, data) => {
            err && console.error(err);
            
            const db = JSON.parse(data);
            db.push(currentCube)

            fs.writeFile(dbPath, JSON.stringify(db), err => {
                if (err) {
                    console.error(err);
                }
                console.log('Successfully added a new cube!');
            });
        })

    }
}

module.exports = Cube;
