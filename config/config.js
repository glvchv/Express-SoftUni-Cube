module.exports = {
    development: {
        port: process.env.PORT || 3000,
        connectionUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cubicle-vovyk.mongodb.net/cubes?retryWrites=true&w=majority`,
        
    },
    production: {}
};