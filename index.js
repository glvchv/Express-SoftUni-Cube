const env = process.env.NODE_ENV || 'development';
const mongoose = require('mongoose');
const authRouter = require('./routes/auth-routes');
const commonRouter = require('./routes/common-routes');
const accessoryRouter = require('./routes/accessory-routes');
const cubeRouter = require('./routes/cube-routes')
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

app.use('/', commonRouter);
app.use('/', authRouter);
app.use('/', cubeRouter);
app.use('/', accessoryRouter);

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Error | Cube Workshop'
  });
});

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));