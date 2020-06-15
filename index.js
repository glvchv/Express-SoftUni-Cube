const env = process.env.NODE_ENV || 'development';
const mongoose = require('mongoose');

const config = require('./config/config')[env];
const app = require('express')();


mongoose.connect(config.connectionUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.error(err);
        throw err;
    }

    console.log("Database is up and running...");
});

require('./config/express')(app);
require('./config/routes')(app);

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));