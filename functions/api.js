//importing needed things
import express from 'express'
//import * as db from './db.js';
import mongoose from "mongoose";
import User from "../models/user.js";


//starting neccessary things (server, and mangoose connection)
console.log('server is starting')
var app = express();
var server = app.listen(3000, (port) => {
    console.log(`Server started on localhost:3000`)
});
mongoose.connect("mongodb+srv://camilldominic:8SFmCg8WZASHlnkC@datcorddb.4s29eat.mongodb.net/Discord2?retryWrites=true&w=majority&appName=DatcordDB")

//http actions and uri's
app.get('/users', getAllUsers)
app.get('/user/:user/:pass', getUser);
app.get('/addUser/:user/:pass', addUser);
app.post('/user/:user/:pass', addUser);

//http action functions
async function getAllUsers(req, res){
    let result = await User.find({})
    let numUsers = await User.find({}).countDocuments();
    console.log('There are ' + numUsers + ' users')
    let allUsers = {};
    for(let i = 0; i<numUsers; i++){
        allUsers[`user${i}`] = result[i].username;
    }
    console.log(result);
    console.log(allUsers);
    res.setHeader('Content-Type', 'application/json');
    res.haeder = {}
    res.send(JSON.stringify(allUsers));
}

async function getUser(req, res){
    /*
    let data = req.params;
    let user = undefined;
    for(let i = 0; i<users.length; i++){
        if(users[i].user == data.user && users[i].pass == data.pass){
            user = users[i];
            res.send(user);
            return;
        }
    }
    */
    let data = req.params;
    let result = await User.find({username: data.user, password: data.pass});
    console.log('User:\n' + result + '\n\n');
    res.send(result);
    return;
}

async function addUser(req, res){
    let data = req.params;
    let result = await User.find({username: data.user, password: data.pass});
    if(result[0] != undefined){
        res.status(400).send("Cannot complete");
        console.log('Duplicate user trying to be created:\n' + result + '\n\n');
        return;
    }
    let user = User.create({
        username: data.user,
        password: data.pass,
    });
    result = await User.find({username: data.user, password: data.pass})[0];
    console.log('New user:\n' + result + '\n\n');
    res.send(result);
    return;
}