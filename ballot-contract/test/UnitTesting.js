// Below site was referred for creation of this test script.
// https://medium.com/coinmonks/test-a-smart-contract-with-truffle-3eb8e1929370
// 
// Primary imports and declarations were adapted as is but all test functions
//  and describe() calls are written on our own.

// const msrve = artifacts.require("MSRVE_Ballot");

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const json = require('../build/contracts/MSRVE_Ballot.json');

const interface = json['abi'];
const bytecode = json['bytecode'];

const contractAddress = json['networks']['5777']['address'];

var admin;
var accounts;
var ballot;

//pre-processing before every test case
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    admin = accounts[9];
    ballot = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode, arguments: [4] })
        .send({ from: admin, gas: '6721975' });
        // .send({ from: admin});
});

//grouping testcases together
describe('Maine State Ranked Voting Election', () => {

    describe('Preliminaries', () => {
        // it('<test_name>', async () => {'<func>'});

        describe('State', () => {
            //testcase
            it('Init State (Registration)', async () => {
                state = await ballot.methods.state().call();
                assert.equal(state, 0, 'Init state = 0');
            });
    
            it('Change State (Vote)', async () => {
                await ballot.methods.changeState(1).send({from:admin});
                state = await ballot.methods.state().call();
                assert.equal(state, 1, 'Vote state = 1');
            });
    
            it('Change State (Done)', async () => {
                await ballot.methods.changeState(2).send({from:admin});
                state = await ballot.methods.state().call();
                assert.equal(state, 2, 'Done state = 2');
            });
    
            it('Change State FAIL for Non-Admin', async () => {
                try {
                    await ballot.methods.changeState(1).send({from:accounts[0]});
                    assert.fail('Change should have failed!');
                } catch (err) {
                    assert.ok(err, 'Error captured Successfully!'); //passed
                }
            });
        });
        
        //test for user registration if they can register
        describe('Registration', ()=>{
            it('Register (Multiple)', async () => {
                state = await ballot.methods.state().call();
                assert.equal(state, 0, 'Init state');
                try {
                    await ballot.methods.register().send({from:accounts[0]});
                    await ballot.methods.register().send({from:accounts[1]});
                    await ballot.methods.register().send({from:accounts[2]});
                    await ballot.methods.register().send({from:accounts[3]});
                    await ballot.methods.register().send({from:accounts[4]});
                    await ballot.methods.register().send({from:accounts[5]});
                    await ballot.methods.register().send({from:accounts[6]});
                    await ballot.methods.register().send({from:accounts[7]});
                    await ballot.methods.register().send({from:accounts[8]});
    
                    assert.ok(1, 'pass');
                } catch (err) {
                    assert.fail(err);
                }
    
            });
    
            it('Register FAIL on Invalid State', async () => {
                await ballot.methods.changeState(1).send({from:admin});
                state = await ballot.methods.state().call();
                assert.equal(state, 1, 'State Change.');
                try {
                    await ballot.methods.register().send({from:accounts[0]});
                    assert.fail('Registration should have failed!');
                } catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }
                
            });
    
            it('Register FAIL Second Time', async () => {
                state = await ballot.methods.state().call();
                assert.equal(state, 0, 'Init state');
                await ballot.methods.register().send({from:accounts[0]});
                try {
                    await ballot.methods.register().send({from:accounts[0]});
                    assert.fail('Registration should have failed!');
                } catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }
                
            });
        });

        describe('Delegation Functions', ()=>{

            it('Delegate to another voter', async ()=>{
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.register().send({from:accounts[1]});
                await ballot.methods.changeState(1).send({from:admin});
    
                let pre_vote = await ballot.methods.voteCount().call();
                await ballot.methods.delegatedTo(accounts[1]).send({from:accounts[0]});
                await ballot.methods.vote([2, 1, 0, 3]).send({from:accounts[1], gas: '6721975'});   // This fails without gas
                let post_vote = await ballot.methods.voteCount().call();
    
                assert.equal(post_vote - pre_vote, 2, 'Vote counted');
            });

            it('Delegate FAIL to self', async ()=>{
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.changeState(1).send({from:admin});
    
                try {
                    await ballot.methods.delegatedTo(accounts[0]).send({from:accounts[0]});
                    assert.fail('This should have failed!');
                }
                catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }    
            });

            it('Delegate FAIL to each other', async ()=>{
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.register().send({from:accounts[1]});
                await ballot.methods.changeState(1).send({from:admin});
    
                try {
                    await ballot.methods.delegatedTo(accounts[1]).send({from:accounts[0]});
                    await ballot.methods.delegatedTo(accounts[0]).send({from:accounts[1]});
                    assert.fail('This should have failed!');
                }
                catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }    
            });

            it('Delegate FAIL in a ring', async ()=>{
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.register().send({from:accounts[1]});
                await ballot.methods.register().send({from:accounts[2]});
                await ballot.methods.register().send({from:accounts[3]});
                await ballot.methods.changeState(1).send({from:admin});
    
                try {
                    await ballot.methods.delegatedTo(accounts[1]).send({from:accounts[0]});
                    await ballot.methods.delegatedTo(accounts[2]).send({from:accounts[1]});
                    await ballot.methods.delegatedTo(accounts[3]).send({from:accounts[2]});
                    await ballot.methods.delegatedTo(accounts[0]).send({from:accounts[3]});
                    assert.fail('This should have failed!');
                }
                catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }  
            });
        });
        
        describe('Voting Functions', ()=>{
            it('Abstain', async () => {
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.changeState(1).send({from:admin});
    
                let pre_vote = await ballot.methods.abstainCount().call();
                await ballot.methods.abstain().send({from:accounts[0]});
                let post_vote = await ballot.methods.abstainCount().call();
    
                assert.equal(post_vote - pre_vote, 1, 'Abstain counted');
    
            });
    
            // No delegation test
    
            it('Vote', async () => {
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.changeState(1).send({from:admin});
    
                let pre_vote = await ballot.methods.voteCount().call();
                await ballot.methods.vote([2, 1, 0, 3]).send({from:accounts[0], gas: '6721975'});   // This fails without gas
                let post_vote = await ballot.methods.voteCount().call();
    
                assert.equal(post_vote - pre_vote, 1, 'Vote counted');
    
            });
    
            it('Vote FAIL without Registration', async () => {
                await ballot.methods.changeState(1).send({from:admin});
                try {
                    await ballot.methods.vote([2, 1, 0, 3]).send({from:accounts[0]});
                    assert.fail('This should have failed!');
                }
                catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }
            });
    
            it('Vote FAIL on Invalid State', async () => {
                // await ballot.methods.changeState(1).send({from:admin});
                try {
                    await ballot.methods.vote([2, 1, 0, 3]).send({from:accounts[0]});
                    assert.fail('This should have failed!');
                }
                catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }
            });
    
            it('Vote FAIL on Double Voting', async () => {
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.changeState(1).send({from:admin});
    
                let pre_vote = await ballot.methods.voteCount().call();
                await ballot.methods.vote([2, 1, 0, 3]).send({from:accounts[0], gas: '6721975'}); 
                let post_vote = await ballot.methods.voteCount().call();
    
                assert.equal(post_vote - pre_vote, 1, 'Vote counted');
    
                try {
                    await ballot.methods.vote([1, 3, 2, 0]).send({from:accounts[0], gas: '6721975'});
                    assert.fail('This should have failed!');
                }
                catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }
    
            });
        });

        describe('Final Calculation',() => {
            it('Calculate Winner', async () => {
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.changeState(1).send({from:admin});
    
                let pre_vote = await ballot.methods.voteCount().call();
                await ballot.methods.vote([2, 1, 0, 3]).send({from:accounts[0], gas: '6721975'});
                let post_vote = await ballot.methods.voteCount().call();
    
                assert.equal(post_vote - pre_vote, 1, 'Vote counted');
    
                await ballot.methods.changeState(2).send({from:admin});
                state = await ballot.methods.state().call();
                assert.equal(state, 2, 'Done state');
    
                await ballot.methods.calcWinner().send({from:admin, gas: '6721975'});
                let winner = await ballot.methods.getWinner().call({from:admin});
    
                assert.equal(winner, 3, 'Last step!');
            });
    
            it('Calculate Winner FAIL without a Single Vote', async () => {
                await ballot.methods.changeState(2).send({from:admin});
                state = await ballot.methods.state().call();
                assert.equal(state, 2, 'Done state');
    
                try {
                    // let winner = await ballot.methods.calcWinner().call({from:admin, gas: '6721975'});
                    await ballot.methods.calcWinner().send({from:admin, gas: '6721975'});
                    assert.fail('Candidate '+winner+' should not have won!');
                }
                catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }
            });

            it('Calculate Winner FAIL by Non-Admin', async () => {
                await ballot.methods.changeState(2).send({from:admin});
                state = await ballot.methods.state().call();
                assert.equal(state, 2, 'Done state');
    
                try {
                    // let winner = await ballot.methods.calcWinner().call({from:admin, gas: '6721975'});
                    await ballot.methods.calcWinner().send({from:accounts[0], gas: '6721975'});
                    assert.fail('Candidate '+winner+' should not have won!');
                }
                catch (err) {
                    assert.ok(err, 'Error captured Successfully!');
                }
            });
        });


    });

    describe('Main Execution (Full Run)', () => {
        it('9 Users + Admin', async () => {
            state = await ballot.methods.state().call();
            assert.equal(state, 0, 'Init state');

            try {
                await ballot.methods.register().send({from:accounts[0]});
                await ballot.methods.register().send({from:accounts[1]});
                await ballot.methods.register().send({from:accounts[2]});
                await ballot.methods.register().send({from:accounts[3]});
                await ballot.methods.register().send({from:accounts[4]});
                await ballot.methods.register().send({from:accounts[5]});
                await ballot.methods.register().send({from:accounts[6]});
                await ballot.methods.register().send({from:accounts[7]});
                await ballot.methods.register().send({from:accounts[8]});

                assert.ok(1, 'pass');
            } catch (err) {
                assert.fail(err);
            }


            await ballot.methods.changeState(1).send({from:admin});
            state = await ballot.methods.state().call();
            assert.equal(state, 1, 'Vote state');

            try {
                let pre_vote = await ballot.methods.voteCount().call();
                //rightmost is highest priority
                await ballot.methods.vote([2, 1, 0, 3]).send({from:accounts[0], gas: '6721975'});
                await ballot.methods.vote([0, 3, 1, 2]).send({from:accounts[1], gas: '6721975'});
                await ballot.methods.vote([3, 2, 1, 0]).send({from:accounts[2], gas: '6721975'});
                await ballot.methods.vote([2, 3, 0, 1]).send({from:accounts[3], gas: '6721975'});
                await ballot.methods.vote([1, 0, 2, 3]).send({from:accounts[4], gas: '6721975'});
                await ballot.methods.vote([1, 0, 2, 3]).send({from:accounts[5], gas: '6721975'});
                await ballot.methods.vote([1, 0, 2, 3]).send({from:accounts[6], gas: '6721975'});
                await ballot.methods.vote([1, 0, 2, 3]).send({from:accounts[7], gas: '6721975'});
                await ballot.methods.vote([1, 0, 2, 3]).send({from:accounts[8], gas: '6721975'});
                await ballot.methods.vote([1, 3, 0, 2]).send({from:admin, gas: '6721975'});
                
                let post_vote = await ballot.methods.voteCount().call();

                assert.equal(post_vote - pre_vote, 10, 'Vote counted');
            } catch (err) {
                assert.fail(err);
            }

            await ballot.methods.changeState(2).send({from:admin});
            state = await ballot.methods.state().call();
            assert.equal(state, 2, 'Done state');

            // let winner = await ballot.methods.reqWinner().call({from:admin, gas: '6721975'});
            
            await ballot.methods.calcWinner().send({from:admin, gas: '6721975'});
            let winner = await ballot.methods.getWinner().call({from:admin});

            assert.equal(winner, 3, 'Last step!');

        });
    });
});

// contract();










