
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