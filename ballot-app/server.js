var express = require("express");
var app = express();
var router = express.Router();  
var bodyParser = require("body-parser");
var path = require('path');
var VT = require('vanillatoasts');
var cookieParser = require('cookie-parser') // TODO: Implement cookies for user management.

var db = require("./db.json");

const ganache = require('ganache-cli');
const Web3 = require('web3');
// const web3 = new Web3(ganache.provider());
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const json = require('../ballot-contract/build/contracts/MSRVE_Ballot.json');

const interface = json['abi'];
const bytecode = json['bytecode'];

const contractAddress = json['networks']['5777']['address'];

var admin;
var accounts;
var ballot;

function startup() {
    // blockchain startup
    web3.eth.getAccounts().then((accs)=>{
        console.log('ACCOUNTS: ', accs);
        accounts = accs ;
        admin = accounts[9];
    });
    ballot = new web3.eth.Contract(interface, contractAddress);
    // console.log(typeof ballot);
    // console.log('ACCOUNTS: ', accounts);
    // console.log('ADMIN: ', admin);
    // console.log(Object.keys(ballot.methods));
}

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cookieParser());

app.set('views', __dirname);
app.set('view engine', 'html'); 

app.get('/', function(req, res){
    res.sendfile('./index.html', {root:__dirname});
});

app.post('/login', function (req, res) {

    user = req.body.user;
    pass = req.body.pass;

    curUser = db.users[user];

    if(curUser.passwd == pass) {
        // res.redirect('landing');
        // res.redirect('https://www.google.co.in/');
        // res.render('/landing');
        // res.redirect('http://localhost:3000/landing');
        // res.sendFile('vote.html',{root:__dirname});
        console.log(req.headers);

        res.cookie('user', user, {maxAge: 3600000});
        res.cookie('addr', curUser.addr, {maxAge: 3600000});
        res.cookie('subject', 'CSE526', {maxAge: 3600000});

        res.status(200).send({addr:curUser.addr});
    }
    else {
        console.log('incorrect');
        res.status(403);
    }
});

app.get('/election',function(req,res){

    console.log('req.cookies:');
    console.log(req.cookies);
    console.log(req.cookies.subject);
    
    // if(req.headers.subject === 'CSE526') {
    if(req.cookies.subject == 'CSE526') {
        console.log('VALID REQ');
        res.setHeader("Content-Type", "text/html")
        res.sendFile(path.join(__dirname, 'vote.html'));
        // res.sendFile( path.resolve('./vote.html') );
        console.log('sent file',path.join(__dirname, 'vote.html'));
    }
    else {
        res.redirect('/');
    }

    console.log('REDIRECT 2');

});

app.post('/register', (req, res) => {
    user = req.body.user;
    userList = db.users;

    if(!user)
        user = 'user1';

    // try {
    //     await ballot.methods.register().send({from:userList[user].addr});
    // } catch (err) {
    //     console.log(err);
    // }

    ballot.methods.register().send({from:userList[user].addr})
        .on('error', (err) => {
            console.log(err);
            let t = VT.create({
                title: 'Error',
                text: err.toString(),
                type: 'error', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
            res.status(200).send({addr:curUser.addr});
        })
        .on('transactionHash', (err) => {
            console.log(hash);
            let t = VT.create({
                title: 'Hash Generated',
                text: hash,
                type: 'success', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
        }) ;


});

app.post('/vote', (req, res) => {
    user = req.body.user;
    userList = db.users;

    ballot.methods.vote([1, 3, 2, 0]).send({from:userList[user].addr})
        .on('error', (err) => {
            console.log(err);
            let t = VT.create({
                title: 'Error',
                text: err.toString(),
                type: 'error', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
            res.status(200).send({addr:curUser.addr});
        })
        .on('transactionHash', (err) => {
            console.log(hash);
            let t = VT.create({
                title: 'Hash Generated',
                text: hash,
                type: 'success', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
        }) ;

});

app.post('/abstain', (req, res) => {
    ballot.methods.abstain().send({from:userList[user].addr})
        .on('error', (err) => {
            console.log(err);
            let t = VT.create({
                title: 'Error',
                text: err.toString(),
                type: 'error', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
            res.status(200).send({addr:curUser.addr});
        })
        .on('transactionHash', (err) => {
            console.log(hash);
            let t = VT.create({
                title: 'Hash Generated',
                text: hash,
                type: 'success', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
        }) ;
});

app.post('/delegate', (req, res) => {
    ballot.methods.delegateTo().send({from:userList[user].addr})
        .on('error', (err) => {
            console.log(err);
            let t = VT.create({
                title: 'Error',
                text: err.toString(),
                type: 'error', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
            res.status(200).send({addr:curUser.addr});
        })
        .on('transactionHash', (err) => {
            console.log(hash);
            let t = VT.create({
                title: 'Hash Generated',
                text: hash,
                type: 'success', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
        }) ;
});

app.post('/winner', (req, res) => {
    ballot.methods.reqWinner().send({from:userList[user].addr})
        .on('error', (err) => {
            console.log(err);
            let t = VT.create({
                title: 'Error',
                text: err.toString(),
                type: 'error', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
            res.status(200).send({addr:curUser.addr});
        })
        .on('transactionHash', (err) => {
            console.log(hash);
            let t = VT.create({
                title: 'Hash Generated',
                text: hash,
                type: 'success', // success, info, warning, error 
                // icon: '/img/alert-icon.jpg', // optional parameter
                timeout: 4000,
                callback: () => { t.hide(); } 
            });
        })
        .then((winner)=>{
            console.log('WINNER: ', winner);
        }) ;
});

app.use('/', router);
app.listen(3000, startup);