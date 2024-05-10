require('dotenv').config();
const express = require('express');
const router = require('./router/router.js');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error-middleware.js');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errorMiddleware);

const start = () => {
    try {
        app.listen(PORT, () =>
            console.log(`SERVER WAS STARTED AT ${PORT} PORT`)
        );
    } catch (err) {
        console.log(err);
    }
};

start();
