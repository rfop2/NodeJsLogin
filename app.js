const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');


const app = express();

// DB Config
// url : mongodb+srv://rodrigo:rodrigo@recifeprev-xv52e.mongodb.net/test?retryWrites=true&w=majority
const db = require('./config/keys').MongoURI;

//Connect to mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended:false})); 

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));



// connect flash
app.use(flash);

//global vars
app.use((req,res,next) => {
    res.locals.sucess_msg = req.flash('sucess_msg');
    res.locals.sucess_msg = req.flash('error_msg');
    next();
});

// Routes
app.use('/' , require('./routes/index'));
app.use('/users' , require('./routes/users'));

const PORT = process.env.PORT || 27017;


app.listen(PORT, console.log(`Server started on port ${PORT}`));
