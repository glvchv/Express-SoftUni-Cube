const mongoose = require('mongoose');

const AccessorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 200
    },
    imageUrl: {
        type: String,
        required: true,
        validate: /(http|https):(\/\/).*/
    },
    cubes: [{
        type: 'ObjectId',
        ref: 'Cube'
    }]
})

module.exports = mongoose.model('Accessory', AccessorySchema);