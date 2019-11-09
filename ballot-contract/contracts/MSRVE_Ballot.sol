pragma solidity ^0.5.11;

contract MSRVE_Ballot {

    struct Voter {
        uint weight;
        bool voted;
        uint256[] vote;
        uint256[] curList;
        uint256 preference;
        address delegate;
    }

    address admin;
    address[] voterList;
    uint256 numProposals;
    uint256[] runningCount;
    bool[] invalidCandidates;
    mapping(address => Voter) voters;

    uint public voteCount;
    uint public abstainCount;

    uint256 public winner;
    bool calc;

    enum Phase {Regs, Vote, Done}

    Phase public state;

    modifier validPhase(Phase reqPhase) {require(state <= reqPhase, "Phase is invalid. Contact admin."); _;}

    modifier onlyAdmin() {require(msg.sender == admin, "YOU. SHALL. NOT. PASS!"); _;}

    modifier canVote() {require(voters[msg.sender].voted == false, "No voting for you kiddo!"); _;}

    constructor (uint8 num) public  {

        admin = msg.sender;
        voters[admin].weight = 1;
        state = Phase.Regs;
        numProposals = num;
        runningCount.length = num;
        invalidCandidates.length = num;
        voteCount = 0;
        abstainCount = 0;
        calc = false;
    }

    function changeState(Phase x) public onlyAdmin{
        state = x;
    }

    function register() public validPhase(Phase.Regs) {

        require (voters[msg.sender].weight == 0, "Already registered!");   // So that func can run once per user.
        voters[msg.sender].weight = 1;
    }

    function vote(uint256[] memory inputArray) public canVote validPhase(Phase.Vote) {

        require(voters[msg.sender].weight > 0, "Register first!");

        runningCount[inputArray[inputArray.length-1]] += voters[msg.sender].weight;

        voters[msg.sender].preference = inputArray[inputArray.length-1];
        voters[msg.sender].vote = inputArray;
        voters[msg.sender].curList = inputArray;
        voters[msg.sender].curList.pop();
        voters[msg.sender].voted = true;
        voterList.push(msg.sender);

        voteCount++;

    }

    function delegatedTo(address to) public canVote validPhase(Phase.Vote) {

        require(to != msg.sender, "Don't delegate to self.");

        Voter storage sender = voters[msg.sender]; // assigns reference

        while (voters[to].delegate != address(0) && voters[to].delegate != msg.sender)
            to = voters[to].delegate;

        if (to == msg.sender)
            revert("Delegation DAG");

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegateTo = voters[to];

        if (!delegateTo.voted)
            delegateTo.weight += sender.weight;
        else
            revert("New person already voted!");
    }

    function abstain() public canVote validPhase(Phase.Vote) {

        voters[msg.sender].voted = true;
        abstainCount++;
    }

    function reqWinner() public validPhase(Phase.Done) returns (uint256 ) {

        require(voterList.length > 0, "No votes!");

        if(calc)
            return winner;

        for(uint8 recur = 0; recur < numProposals-1; recur += 1){
            // Loop should have a solution in numProposals-1 iterations.
            // While loop here could cause infinite loop.

            uint256 max = 0;
            uint256 min = 2**10;
            uint256 win = numProposals;
            uint256 lose = 0;

            for(uint8 i = 0; i < numProposals; i += 1){
                if(max<runningCount[i]) {
                    max = runningCount[i];
                    win = i;
                }
                if(min>runningCount[i] && !invalidCandidates[i]) {
                    min = runningCount[i];
                    lose = i;
                }
            }

            if(max > voteCount / 2) {
                winner = win;
                calc = true;
                return winner;
            }
            else {
                invalidCandidates[lose] = true;
                runningCount[lose] = 0;
                for(uint8 j = 0; j < voterList.length; j += 1) {
                    if(voters[voterList[j]].preference == lose){
                        // recalc
                        voters[voterList[j]].preference = voters[voterList[j]].curList[voters[voterList[j]].curList.length-1];
                        voters[voterList[j]].curList.pop();
                        runningCount[voters[voterList[j]].preference] += 1;
                    }
                }
            }


        }
        return winner;
    }
}
