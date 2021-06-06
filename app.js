const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

require('dotenv').config();

// connection to db
mongoose.connect('mongodb://localhost/crud-mongo-PF-Tests',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/routeindex');


// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');


// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


// routes
app.use('/', indexRoutes);
//*****new 
app.use(express.static('public'));

app.listen(app.get('port'), () =>{
    console.log(`server on port ${app.get('port')}`);
})


