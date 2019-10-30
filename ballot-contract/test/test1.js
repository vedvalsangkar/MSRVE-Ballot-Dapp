// var ballot = await MSRVE_Ballot.deployed()
// var ballot = MSRVE_Ballot.deployed()
// var acc = await web3.eth.getAccounts()
var acc = web3.eth.getAccounts()

const artifacts = require('../build/contracts/MSRVE_Ballot.json')
const contract = require('truffle-contract')
const MyContract = contract(artifacts);
MyContract.setProvider(web3.currentProvider);

ballot = MyContract.deployed()

var admin = acc[9]

ballot.register({from:acc[0]})
ballot.register({from:acc[1]})
ballot.register({from:acc[2]})
ballot.register({from:acc[3]})
ballot.register({from:acc[4]})

ballot.changeState(1, {from:admin})

ballot.vote([2, 1, 0, 3], {from:acc[0]})
ballot.vote([0, 3, 1, 2], {from:acc[1]})
ballot.vote([3, 2, 1, 0], {from:acc[2]})
ballot.vote([2, 3, 0, 1], {from:acc[3]})
ballot.vote([1, 0, 2, 3], {from:acc[4]})
ballot.vote([1, 3, 0, 2], {from:admin})

ballot.changeState(2, {from:admin})

var answer = ballot.reqWinner({from:acc[0]})
