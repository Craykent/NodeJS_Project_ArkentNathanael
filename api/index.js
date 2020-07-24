const express = require('express');
const Joi = require('joi');
const app = express();
const mysql = require('mysql');

// RUN WEB SERVER AT PORT 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})



app.use(express.json());
app.use((req,res,next)=>{
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});

//Temporary Data
const users = [
    {id:1, username: 'Craykent', email:'arkent.huang@gmail.com', password:'12345678'},
    {id:2, username: 'Cray', email:'arkent.huang123@gmail.com', password:'12345678'}
]

app.get('/api/users', (req,res)=>{

    var datetime = new Date();
    console.log("\n"+ datetime);
    console.log("Retrieving user data...");
    return res.json(users);
});

//Register
app.post('/api/users', (req,res)=>{


    var datetime = new Date();
    console.log("\n"+ datetime);
    console.log("Incoming HTTP Request!");
    console.log(req.body);

    const {error} = validateUserRegis(req.body);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation is a success and accepted... Moving on!');

    console.log('Checking existing email:' +req.body.email);

    const check_user = users.find(u => u.email === req.body.email);
    if(check_user) {
        console.log('Email: ' + req.body.email+ ' has been registered!');

        var jsonRespond = {
            result: "",
            message: 'Registration failed. Email: ' +req.body.email+ ' is already registered! Please use another email!'
        }
        return res.status(404).json(jsonRespond);
    }

    const user = {
        id : users.length + 1,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    };

    users.push(user);
    return res.json(user);
});

//Login
app.get('/api/users/:email/:password', (req,res)=>{

    var datetime = new Date();
    console.log("\n"+ datetime);
    console.log("Incoming new GET HTTP request");
    console.log(req.body);

    const {error} = validateUserLogin(req.body);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Check existing username: '+req.params.username+' and password: '+req.params.password);
    const check_user = users.find( u => u.username === req.params.username && u.password === req.params.password );
    if (!check_user) {
        var error_message = 'Invalid login detail. Username or password is not correct.';
        console.log(error_message);

        var jsonRespond = {
            result: "",
            message: error_message
        }

        return res.status(404).json(jsonRespond);
    }
    var jsonRespond = {
        message: "Login Successful!"
    }
    return res.json(jsonRespond);
})

//CRUD Movies
app.get('/api/movies', (req,res)=>{

})


function validateUserRegis(user){
    const schema = Joi.object({
        username: Joi.string().min(5).max(100).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: {allow:['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    return schema.validate(user);
}

function validateUserLogin(user){
    const schema = Joi.object({
        username: Joi.string().min(1).max(100).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    return schema.validate(user);
}
