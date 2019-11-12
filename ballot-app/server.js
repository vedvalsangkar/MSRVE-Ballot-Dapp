var express = require("express");
var app = express();
var router = express.Router();  
var bodyParser = require("body-parser");
var path = require('path');
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
    console.log('Server started');
}

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cookieParser());

app.use(function (req, res, next) {        
    res.setHeader('Access-Control-Allow-Origin', '*');    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');      
    res.setHeader('Access-Control-Allow-Headers', '*');      
    // res.setHeader('Access-Control-Allow-Credentials', true);       
    next();  
}); 

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

        res.clearCookie('user');
        res.clearCookie('addr');
        res.clearCookie('subject');

        res.cookie('user', user, {maxAge: 3600000});
        res.cookie('addr', curUser.addr, {maxAge: 3600000});
        res.cookie('subject', 'CSE526', {maxAge: 3600000});

        res.status(200).send({addr:curUser.addr});
    }
    else {
        console.log('incorrect');
        res.status(403).send();
    }
});

app.get('/election',function(req,res){

    // console.log('req.cookies:');
    console.log(req.cookies);
    // console.log(req.cookies.subject);
    
    // if(req.headers.subject === 'CSE526') {
    if(req.cookies.subject == 'CSE526') {
        console.log('VALID REQ');
        res.setHeader("Content-Type", "text/html")
        res.sendFile(path.join(__dirname, 'vote.html'));
        // res.sendFile( path.resolve('./vote.html') );
    }
    else {
        res.redirect('/');
    }


});

app.post('/register', (req, res) => {

    console.log('INSIDE REGISTER API');
    user = req.cookies.user;
    // userList = db.users;

    if(!user) {
        console.log('NO USER FOUND!');
        user = 'user1';
        // res.status(403).send({'Error':'No user'});
    }

    // try {
    //     await ballot.methods.register().send({from:userList[user].addr});
    // } catch (err) {
    //     console.log(err);
    // }

    ballot.methods.register().send({from:req.cookies.addr})
        .on('error', (err, rec) => {
            console.log('REGISTER ON ERROR');
            console.log(err);
            // res.write();
            // res.status(200).send({'Reciept': rec, 'Error':err, });
            res.write(JSON.stringify({'RecieptOnError': JSON.stringify(rec), 'Error':err.toString() }));
        })
        .on('transactionHash', (hash) => {
            console.log('REGISTER ON HASH');
            console.log(hash);
            res.write(JSON.stringify({'Hash': hash}));
        })
        .then((rec)=>{
            console.log('REGISTER ON RECIEPT');
            console.log(rec);
            res.write(JSON.stringify({'Reciept': JSON.stringify(rec)}));
            res.end();
            // res.send({'Reciept': rec});
        })
        .catch((err2)=>{
            console.log("\nREGISTER ERROR IN CATCH\n");
            console.log(err2);
            res.status(200).write(JSON.stringify({'ErrorCatch':err2.toString()}));
            res.end();
        })
        ;


});

app.post('/vote', (req, res) => {
    // user = req.body.user;
    // userList = db.users;
    let pref = req.body.vote;
    console.log('VOTE CASTED:', pref)

    if(!pref)
        pref = [1, 0, 3, 2];

    ballot.methods.vote(pref).send({from:req.cookies.addr, gas: '6721975'})
        .on('error', (err, rec) => {
            console.log('VOTE ON ERROR');
            console.log(err);
            // res.write();
            // res.status(200).send({'Reciept': rec, 'Error':err, });
            res.write(JSON.stringify({'RecieptOnError': JSON.stringify(rec), 'Error':err.toString() }));
        })
        .on('transactionHash', (hash) => {
            console.log('VOTE ON HASH');
            console.log(hash);
            res.write(JSON.stringify({'Hash': hash}));

        })
        .then((rec)=>{
            console.log('VOTE ON RECIEPT');
            console.log(rec);
            res.write(JSON.stringify({'Reciept': JSON.stringify(rec)}));
            res.end();
            // res.send({'Reciept': rec});
        })
        .catch((err2)=>{
            console.log("\nVOTE ERROR IN CATCH\n");
            console.log(err2);
            res.status(200).write(JSON.stringify({'ErrorCatch':err2.toString()}));
            res.end();
        })
        ;

});

app.post('/abstain', (req, res) => {
    ballot.methods.abstain().send({from:req.cookies.addr})
        .on('error', (err, rec) => {
            console.log('ABSTAIN ON ERROR');
            console.log(err);
            // res.write();
            // res.status(200).send({'Reciept': rec, 'Error':err, });
            res.write(JSON.stringify({'RecieptOnError': JSON.stringify(err), 'Error':err.toString() }));
        })
        .on('transactionHash', (hash) => {
            console.log('ABSTAIN ON HASH');
            console.log(hash);
            res.write(JSON.stringify({'Hash': hash}));
        })
        .then((rec)=>{
            console.log('ABSTAIN ON RECIEPT');
            console.log(rec);
            res.write(JSON.stringify({'Reciept': JSON.stringify(rec)}));
            res.end();
            // res.send({'Reciept': rec});
        })
        .catch((err2)=>{
            console.log("\nABSTAIN ERROR IN CATCH\n");
            console.log(err2);
            res.status(200).write(JSON.stringify({'ErrorCatch':err2.toString()}));
            res.end();
        })
        ;
});

app.post('/delegate', (req, res) => {
    console.log(req.userTo);
    console.log(req.body.userTo);
    ballot.methods.delegatedTo(db.users[req.body.userTo].addr).send({from:req.cookies.addr})
        .on('error', (err, rec) => {
            console.log('DELEGATE ON ERROR');
            console.log(err);
            // res.write();
            // res.status(200).send({'Reciept': rec, 'Error':err, });
            res.write(JSON.stringify({'RecieptOnError': JSON.stringify(rec), 'Error':err.toString() }));
        })
        .on('transactionHash', (hash) => {
            console.log('DELEGATE ON HASH');
            console.log(hash);
            res.write(JSON.stringify({'Hash': hash}));
        })
        .then((rec)=>{
            console.log('DELEGATE ON RECIEPT');
            console.log(rec);
            res.write(JSON.stringify({'Reciept': JSON.stringify(rec)}));
            res.end();
            // res.send({'Reciept': rec});
        })
        .catch((err2)=>{
            console.log("DELEGATE ERROR IN CATCH\n");
            console.log(err2);
            res.status(200).write(JSON.stringify({'ErrorCatch':err2.toString()}));
            res.end();
        })
        ;
});

app.post('/calcWinner', (req, res) => {
    ballot.methods.calcWinner().send({from:req.cookies.addr, gas: '6721975'})
        .on('error', (err, rec) => {
            console.log('WINNER CALC ON ERROR');
            console.log(err);
            // res.write();
            // res.status(200).send({'Reciept': rec, 'Error':err, });
            res.write(JSON.stringify({'RecieptOnError': JSON.stringify(rec), 'Error':err.toString() }));
        })
        .on('transactionHash', (hash) => {
            console.log('WINNER CALC ON HASH');
            console.log(hash);
            res.write(JSON.stringify({'Hash': hash}));
        })
        .then((rec)=>{
            console.log('WINNER CALC ON RECIEPT');
            console.log(rec);
            res.write(JSON.stringify({'Reciept': JSON.stringify(rec)}));
            res.end();
            // res.send({'Reciept': rec});
        })
        .catch((err2)=>{
            console.log("WINNER CALC ERROR IN CATCH\n");
            console.log(err2);
            res.status(200).write(JSON.stringify({'ErrorCatch':err2.toString()}));
            res.end();
        })
        ;
});

app.post('/winner', (req, res) => {

    ballot.methods.getWinner().call({from:req.cookies.addr, gas: '6721975'})
        .then((WinningCandidate)=>{
            console.log('WINNER ON COMPLETION');
            // console.log(err);
            console.log(WinningCandidate);
            // res.write(JSON.stringify({'Winner': JSON.stringify(WinningCandidate)}));
            // res.end();
            res.send({'Winner': WinningCandidate});
        })
        // .then(console.log)
        .catch((err2)=>{
            console.log("WINNER ERROR IN CATCH\n");
            console.log(err2);
            // res.status(200).write(JSON.stringify({'ErrorCatch':err2.toString()}));
            // res.end();
            res.send({'ErrorCatch':err2.toString()});
        })
        ;
});

app.post('/changestate', (req, res) => {
    ballot.methods.changeState(req.body.newState).send({from:req.cookies.addr})
        .on('error', (err, rec) => {
            console.log('CHANGE STATE ON ERROR');
            console.log(err);
            // res.write();
            // res.status(200).send({'Reciept': rec, 'Error':err, });
            res.write(JSON.stringify({'RecieptOnError': JSON.stringify(rec), 'Error':err.toString() }));
        })
        .on('transactionHash', (hash) => {
            console.log('CHANGE STATE ON HASH');
            console.log(hash);
            res.write(JSON.stringify({'Hash': hash}));
        })
        .then((rec)=>{
            console.log('CHANGE STATE ON RECIEPT');
            console.log(rec);
            res.write(JSON.stringify({'Reciept': JSON.stringify(rec)}));
            res.end();
            // res.send({'Reciept': rec});
        })
        .catch((err2)=>{
            console.log("CHANGE STATE ERROR IN CATCH\n");
            console.log(err2);
            res.status(200).write(JSON.stringify({'ErrorCatch':err2.toString()}));
            res.end();
        })
        ;
});

function validations() {
    // TODO: redirect to login page if invali cookies
}

app.use('/', router);
app.listen(3000, startup);