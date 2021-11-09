require('dotenv').config();
const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const authController = require('./controllers/authController');

if (process.env.NODE_ENV == 'dev') {
    app.use(require('morgan')('combined'))
}
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.set('view engine', 'pug')


app.post('/api/v1/login', authController.login);
app.post('/api/v1/signup', authController.signup);
app.get('/api/v1/logout', authController.logout)

app.use('/api/v1/products/', require('./routers/productRouter'));

app.use('/', require('./routers/viewRouter'));

app.all('*', (req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

app.use((err, req, res, next) => {
    if (err) {
        console.log(err)
        if (process.env.NODE_ENV == 'dev') {
            res.status(500).json({
                message: err.message,
                stack: err.stack
            });
        } else {
            res.status(500).json({
                message: 'There was an error'
            })
        }
    }
})



const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`App listening on port ${port}.`);
})