const express= require('express');
const mongoose= require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const pageRoute= require('./routes/pageRoute');
const updateRoute= require('./routes/updateRoute');
const userRoute= require('./routes/userRoute');
//npm init, express, nodemon(package)



const app= express();

mongoose.connect('mongodb://localhost/my_database').then(()=> {
    console.log('DB baglandi');
});

//Template Engine
app.set("view engine", "ejs");


//Global Veriable
global.userIN= null;


//Middlewares


app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
    session({
    secret: 'my_keyboard_cat', // Buradaki texti değiştireceğiz.
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/my_database' }),
    })
    );
//Routes
app.use('*', (req, res, next) => {
    userIN = req.session.userID;
    next();
    });
app.use('/' , pageRoute);
app.use('/update' , updateRoute);
app.use('/users' , userRoute);




const port= 3000;

app.listen(port, ()=> {
    console.log('başladı');
});