const express= require('express');
const mongoose= require('mongoose');

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

//Middlewares
app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Routes
app.use('/' , pageRoute);
app.use('/update' , updateRoute);
app.use('/users' , userRoute);


const port= 3000;

app.listen(port, ()=> {
    console.log('başladı');
});