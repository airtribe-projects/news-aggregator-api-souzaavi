const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const usersRoute = require('./routes/usersRoute');
const newsRoute = require('./routes/newsRoute');

const errorHandler = require("./middleware/error_handler");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', usersRoute);
app.use('/news', newsRoute);
app.use(errorHandler);

mongoose.connect(process.env.DB_CON_STR,).then(() => {
    console.log('Connected to database');
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Error connecting to database. And hence failed to spring' +
      ' up the server.', err);
});



module.exports = app;