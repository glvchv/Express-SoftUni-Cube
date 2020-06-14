const Accessory = require('../models/accessory');

const getAccessoryById = async (id) => {
    return await Accessory.findById(id).lean();
}

const attachAccessoryToCube = async (accessoryId, cubeId) => {
    return await Accessory.findByIdAndUpdate(accessoryId, {$push: {cubes: cubeId}}, {useFindAndModify: false});
}

const showAvailableAccessories = async (cubeId) => {
    return await Accessory.find({cubes: {$nin: cubeId}}).lean();
}

module.exports = {
    getAccessoryById,
    attachAccessoryToCube,
    showAvailableAccessories
}