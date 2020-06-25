const Accessory = require('../models/accessory');

const getAccessoryById = async (id) => {
    try {
        const accessory = await Accessory.findById(id).lean();
        return accessory;

    } catch (err) {
        return err;
    }
}

const attachAccessoryToCube = async (accessoryId, cubeId) => {
    try {
        return await Accessory.findByIdAndUpdate(accessoryId, {
            $push: {
                cubes: cubeId
            }
        }, {
            useFindAndModify: false
        });
    } catch (err) {
        return err;
    }
}

const showAvailableAccessories = async (cubeId) => {
    try {
        return await Accessory.find({
            cubes: {
                $nin: cubeId
            }
        }).lean();
    } catch (err) {
        return err;
    }
}

module.exports = {
    getAccessoryById,
    attachAccessoryToCube,
    showAvailableAccessories
}