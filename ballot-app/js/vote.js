
$('.validVoteForm').on('submit',function(){
    var sum = 0;
    var f1 = document.getElementsByName('field1');
    for (var j = 1; j <= 4; j++){
        var f1 = document.getElementsByName('field'+j);
        for (var i = 0, length = f1.length; i < length; i++){
            if(f1[i].checked)
            {
                console.log("got val!", f1[i].value, "for : ", j);
                sum += parseInt(f1[i].value, 10);
            }
        }
    }
    // console.log("output ",summ);
    // console.log("gyuhjhbgujikhbuij", $('.validvote .field2'));
    
    return sum==10;
});

// var VT = require('vanillatoasts');
// function notif() {
//     // var VT = require('vanillatoasts');
    
//     // VanillaToasts.create({
//     //     title: 'VToast',
//     //     text: 'VToast',
//     //     type: 'success', // success, info, warning, error 
//     //     // icon: '/img/alert-icon.jpg', // optional parameter
//     //     timeout: 4000,
//     // });
//     // toastr.options
//     toastr.success("Your Bid is Revealed!");
    
// }

// var serverIP = 'localhost';


window.addEventListener("load", function () {
    if (localStorage.getItem("votePageLoad") === null) {
        /** Your code here. **/
        toastr.success("Login successful!");
        localStorage.setItem("votePageLoad", true);
    }
});

function register() {
    console.log('Registering');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://'+serverIP+':3000/register', true);
    // xhr.open('POST', 'http://localhost:3000/register', true);
    // xhr.open('POST', 'http://196.168.1.186/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send();

    xhr.addEventListener('load', (r)=>{
        console.log('LOADED');
        // console.log(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        resp = JSON.parse(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        console.log(resp);
        if(resp.Hash) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            toastr.success("Hash Generated: "+resp.Hash, "Registered successfully!");
        }
        else if(resp.Error || resp.ErrorCatch) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            if(resp.Error.includes('Already registered!'))
                toastr.error('You seem to have registered already.', "Already registered!!");
            else if(resp.Error.includes('Phase is invalid. Contact admin'))
                toastr.error('Registration stage has passed. You cannot register now.', "Registration Ended!");
            else toastr.error(resp.Error, "Registration failed!");
        }
    });
}

function abstain() {
    console.log('Abstaining');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://'+serverIP+':3000/abstain', true);
    // xhr.open('POST', 'http://localhost:3000/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send();

    xhr.addEventListener('load', (r)=>{

        // console.log(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        resp = JSON.parse(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        console.log(resp);
        if(resp.Hash) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            toastr.success("Hash Generated: "+resp.Hash, "Abstained successfully!");
        }
        else if(resp.Error || resp.ErrorCatch) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            if(resp.Error.includes('No voting for you kiddo!'))
                toastr.error('You seem to have cast your vote already.', "Cannot Abstain!");
            else if(resp.Error.includes('Phase is invalid. Contact admin'))
                toastr.error('Voting stage has passed or not yet active. You cannot abstain now.', "Cannot Abstain!");
            else toastr.error(resp.Error, "Abstain failed!");
        }
    });
}

function delegate() {

    // newUser = document.getElementById('delTo').value;
    let data = JSON.stringify({'userTo':document.getElementById('delTo').value});

    console.log('Delegating');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://'+serverIP+':3000/delegate', true);
    // xhr.open('POST', 'http://localhost:3000/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(data);

    xhr.addEventListener('load', (r)=>{

        // console.log(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        resp = JSON.parse(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        console.log(resp);
        if(resp.Hash) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            toastr.success("Hash Generated: "+resp.Hash, "Delegated successfully!");
        }
        else if(resp.Error || resp.ErrorCatch) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            if(resp.Error.includes('No voting for you kiddo!'))
                toastr.error('You seem to have cast your vote already.', "Cannot Vote Again!");
            else if(resp.Error.includes('Phase is invalid. Contact admin'))
                toastr.error('Voting stage has passed or not yet active. You cannot delegate now.');
            else if(resp.Error.includes('Delegation DCG'))
                toastr.error('Delegation Cycle detected.', "Cannot Delegate!");
            else if(resp.Error.includes('New person already voted!'))
                toastr.error('The person you wish to assign your voting right to has voted.', "Cannot Delegate!");
            else toastr.error(resp.Error, "Delegation failed!");
        }
    });
}

function changeState() {

    let data = JSON.stringify({'newState':1});

    console.log('Changing State');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://'+serverIP+':3000/delegate', true);
    // xhr.open('POST', 'http://localhost:3000/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(data);

    xhr.addEventListener('load', (r)=>{

        // console.log(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        resp = JSON.parse(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        console.log(resp);
        if(resp.Hash) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            toastr.success("Hash Generated: "+resp.Hash, "State changed successfully!");
        }
        else if(resp.Error || resp.ErrorCatch) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            if(resp.Error.includes('YOU. SHALL. NOT. PASS!'))
                toastr.error('You are not Admin.', "YOU. SHALL. NOT. PASS!");
            else toastr.error(resp.Error, "Change State failed!");
        }
    });
}

function getWinner() {
    console.log('Getting winner');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://'+serverIP+':3000/winner', true);
    // xhr.open('POST', 'http://localhost:3000/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send();

    xhr.addEventListener('load', (r)=>{

        // console.log(xhr.responseText);
        resp = JSON.parse(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        console.log(resp);
        if(resp.Winner) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            // toastr.success("Hash Generated: "+resp.Hash, "We have a winner!");
            toastr.success("Congrats Candidate "+resp.Winner+' on winning the election!', "The people hath spoken!");
            document.getElementById('winnerLable').innerText = 'Candidate '+resp.Winner;
        }
        else if(resp.ErrorCatch) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            if(resp.ErrorCatch.includes('Winner not calculated!'))
                toastr.error('The winner has not been calculated by Admin yet', "Winner not calculated!");
            else if(resp.ErrorCatch.includes('Phase is invalid. Contact admin'))
                toastr.error('Election is not over yet.');
            else toastr.error(resp.ErrorCatch, "No winner!");
        }
    });
}

function calculateWinner() {
    console.log('Getting winner');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://'+serverIP+':3000/winner', true);
    // xhr.open('POST', 'http://localhost:3000/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send();

    xhr.addEventListener('load', (r)=>{

        // console.log(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        resp = JSON.parse(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
        console.log(resp);
        if(resp.Hash) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            toastr.success("Hash Generated: "+resp.Hash, "We have a winner!");
            toastr.success("Congrats Candidate: "+resp.Winner);
        }
        else if(resp.Error || resp.ErrorCatch) {
            // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
            if(resp.Error.includes('YOU. SHALL. NOT. PASS!'))
                toastr.error('You are not Admin.', "YOU. SHALL. NOT. PASS!");
            else if(resp.Error.includes('Phase is invalid. Contact admin'))
                toastr.error('Change State if you wish to end the election.', "Election Not Over.");
            else if(resp.Error.includes('No votes!'))
                toastr.error('There were no votes in the vote bank.', "Nobody voted!");
            else if(resp.Error.includes('Winner already calculated!'))
                toastr.error('Votes were calculated. No need to repeat calculations.', "Calculation Done Already!");
            else toastr.error(resp.Error, "No winner!");
        }
    });
}

function vote() {
    console.log('Voting');
    let answer = new Array(4).fill(-1);
    for (var candidateNum = 1; candidateNum <= 4; candidateNum++){
        let candidate  = document.getElementsByName('field'+candidateNum);
        for (var rank = 0, length = candidate.length; rank < length; rank++){
            if(candidate[rank].checked)
            {
                console.log("got rank value", candidate[rank].value, "for candidate", candidateNum);
                answer[4-candidate[rank].value] = candidateNum-1;
                // total += parseInt(candidate[rank].value);
            }
        }
    }
    console.log('Final selection:', answer, 'valid:', !answer.includes(-1));

    if(!answer.includes(-1)) {

        let data = JSON.stringify({'vote':answer});

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://'+serverIP+':3000/vote', true);
        // xhr.open('POST', 'http://localhost:3000/register', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(data);

        xhr.addEventListener('load', (r)=>{

            // console.log(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
            resp = JSON.parse(xhr.responseText.replace(new RegExp("}{", 'g'), ","));
            console.log(resp);
            if(resp.Hash) {
                // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
                toastr.success("Hash Generated: "+resp.Hash, "Voted successfully!");
            }
            else if(resp.Error || resp.ErrorCatch) {
                // toastr.success("Hash Generated: "+(!!resp.Hash)?:resp.Reciept.transactionHash);
                if(resp.Error.includes('No voting for you kiddo!'))
                    toastr.error('You seem to have cast your vote already.', "Cannot Vote!");
                else if(resp.Error.includes('Phase is invalid. Contact admin'))
                    toastr.error('Voting stage has passed or not yet active. You cannot vote right now.', "Cannot Vote!");
                else toastr.error(resp.Error, "Vote failed!");
            }
        });
    }
    else {
        toastr.error('You have not voted correctly. Choose only one candidate for a rank.', "Incorrect Vote!");
    }

    
}
