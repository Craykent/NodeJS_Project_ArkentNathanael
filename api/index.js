//This is the Index.js file for Project
const express = require('express');
const Joi = require('joi');
const app = express();

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
    {id:1, fName: 'Arkent Nathanael', email:'arkent.huang@gmail.com', password:'12345678'}
];

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

    const {error} = validateUser(req.body);
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
    const check_user = users.find( u=> u.email === req.body.email);
    if(check_user){
        console.log('Email: ' +req.body.email + ' is already registered');

        var jsonRespond = {
            result: "",
            message: "Registration failed! Email: " + req.body.email+ " is already registered. Please use other email."
        }
        return res.status(404).json(jsonRespond);
    }

    console.log('Email' + req.body.email + ' is available for registration');
    const user = {
    id: users.length + 1,
    fName: req.body.fName,
    email: req.body.email,
    password: req.body.password
    };

    users.push(user);
    return res.json(user);
});


function validateUser(user){
    const schema = Joi.object({
        fName: Joi.string().min(1).max(100).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: {allow:['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });

    return schema.validate(user);
}

