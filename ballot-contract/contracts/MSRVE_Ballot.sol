pragma solidity ^0.5.11;

contract MSRVE_Ballot {

    struct Voter {

        uint weight;
        bool voted;
        uint8[] vote;
        address delegate;
    }

    struct Proposal {
        uint256[] vote;
        // bytes vote;
    }

    address admin;
    uint256 numProposals;
    mapping(address => Voter) voters;
    // Proposal[] proposals;
    Proposal[][] proposals;

    uint voteCount;
    uint abstainCount;

    // bytes _rankVote;

    uint256[] public _rankVote;
    uint256 public winner;
    uint256 public cand;
    uint256[] public voted;
    bool public calc;

    enum Phase {Regs, Vote, Done}

    Phase public state;

    modifier validPhase(Phase reqPhase) { require(state <= reqPhase, "Phase is invalid. Contact admin."); _; }

    modifier onlyAdmin() { require(msg.sender == admin, "YOU. SHALL. NOT. PASS!"); _; }

    modifier canVote() { require(voters[msg.sender].voted == false, "Access denied!"); _; }

    constructor (uint8 num) public  {

        admin = msg.sender;
        voters[admin].weight = 1;
        // check if this can be used for 2D array.
        proposals.length = num;
        state = Phase.Regs;
        numProposals = num;
        voteCount = 0;
        // winner = -1;
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

        address voter = msg.sender;

        voteCount += voters[voter].weight;
        voters[voter].voted = true;

        // bytes memory _tmp = inputArray;
        // _rankVote = int(inputArray);

        _rankVote = inputArray;
        voted = inputArray;

        // byte candidate = _rankVote.pop();

        uint256 candidate = uint256(_rankVote[_rankVote.length - 1]);
        cand = candidate;

        delete _rankVote[_rankVote.length - 1];
        _rankVote.length = _rankVote.length - 1;

        proposals[candidate].push(Proposal(_rankVote));        // New data type is needed for pushing.
        voteCount += voters[msg.sender].weight;
    }

    function delegatedTo(address to) public canVote validPhase(Phase.Vote) {

        require(to != msg.sender, "Don't delegate to self.");

        Voter storage sender = voters[msg.sender]; // assigns reference

        while (voters[to].delegate != address(0) && voters[to].delegate != msg.sender)
            to = voters[to].delegate;

        if (to == msg.sender)
            revert();

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegateTo = voters[to];

        if (!delegateTo.voted)
            delegateTo.weight += sender.weight;
        else
            revert();
    }

    function abstain() public canVote validPhase(Phase.Vote) {

        voters[msg.sender].voted = true;
        abstainCount += 1;
    }

    function reqWinner() public validPhase(Phase.Done) returns (uint256 ) {

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

                if(proposals.length == 0)
                    continue;

                if(max<proposals[i].length){
                    max = proposals[i].length;
                    win = i;
                }
                if(min>proposals[i].length){
                    min = proposals[i].length;
                    lose = i;
                }
            }

            if(proposals[win].length>voteCount/2){
                // winningProposal = win;
                // break;
                winner = win;
                calc = true;
                return win+1;
            }
            else {
                Proposal[] memory deleteStack = proposals[lose];
                for(uint8 j = 0; j < deleteStack.length; j = 1) {
                    // Proposal memory tmp = deleteStack[j];
                    // _rankVote = bytes(deleteStack[j].vote);
                    _rankVote = deleteStack[j].vote;
                    uint256 change = _rankVote[_rankVote.length - 1];
                    delete _rankVote[_rankVote.length - 1];
                    _rankVote.length = _rankVote.length - 1;
                    proposals[change].push(Proposal(_rankVote));
                    // byte change = tmp.vote[tmp.vote.length - 1];
                    // delete tmp.vote[tmp.vote.length - 1];
                    // tmp.vote.length -= 1;
                }
                delete proposals[lose];
            }

        }

        return winner;
        // return win;
        // winningProposal = 0;
    }
}
