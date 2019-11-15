# MSRVE-Ballot
A blockchain solution to Maine state ranked voting system.

Refer the project report for the walk-through and the instructions.

MSRVE_Ballot.sol is available in MSRVE-Ballot-Dapp/ballot-contract/contract

## Setup
1. Clone repo and enter folder MSRVE-Ballot-Dapp.
2. Run command `npm run setup` to install all required node modules at their appropriate locations.
    1. Alternatively, navigate to folders ballot-app and ballot-contract and run command npm install at both locations.
3. Open Ganache GUI. Initiate a developement blockchain.
4. Navigate to folder MSRVE-Ballot-Dapp/ballot-contract/migrations and modify JavaScript files by replacing the address there with the address of admin account (the address of the last user from Ganache GUI).
5. Run command `npm start` in folder MSRVE-Ballot-Dapp/ballot-contract which shall compile and migrate the Smart Contract.
6. For Windows users, [ip.sh](ballot-app/ip.sh) file in ballot-app folder will need to be changed as this repo was developed in Ubuntu. This file is a work around.

## Run
1. Run command npm run demo in folder MSRVE-Ballot-Dapp or MSRVE-Ballot-Dapp/ballot-app to start the demo run.

##### OR

1. Navigate to MSRVE-Ballot-Dapp/ballot-contract and run command `npm start`.
2. Navigate to MSRVE-Ballot-Dapp/ballot-app and run command `npm start`.

## Test
1. To use the testing framework and test the Smart Contract, run command `npm test` in folder MSRVE-Ballot-Dapp or MSRVE-Ballot-Dapp/ballot-contract to start the test run.

## Admin privilege functions

To change states and to trigger the final vote calculation, run the following steps:

1. Navigate to MSRVE-Ballot-Dapp/ballot-contract and run command `truffle console`. Run all following commands in this console.
Note: It is assumed that the admin is set as the last user from the Ganache user list as stated in Step 4 of Setup.
2. Enter command var ballot = await MSRVE Ballot.deployed() to get the deployed contract.
3. Enter command var acc = await web3.eth.getAccounts() to get the accounts available in Ganache.
4. To change the Smart Contract state, run command `ballot.changeState(\<state>, from:acc[9])`, where \<state> is the new state. 0 is for Registration, 1 for Voting and 2 for Done state.
5. To calculate the final winner, run command `ballot.calcWinner(from:acc[9])`.
