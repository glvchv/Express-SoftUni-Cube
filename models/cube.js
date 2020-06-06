const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');

class Cube {
    constructor(name, description, imageUrl, difficulty) {
        this.id = uniqid();
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.difficulty = difficulty;
    }
    saveCuve() {
        const data = {
            id : this.id,
            name : this.name,
            description : this.description,
            imageUrl : this.imageUrl,
            difficulty : this.difficulty
        }
        fs.writeFile(path.join(__dirname, '..', 'config/database.json'), JSON.stringify(data), err => {
            if (err) {
                console.error(err);
                console.log('yes brah');
            }
            console.log('Successfully added a new cube!');
        });
    }
}

module.exports = Cube;
