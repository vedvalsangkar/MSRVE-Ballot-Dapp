
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        // $(this).focus(function(){
        //    hideValidate(this);
        // });
        if(validate(this) == false){
            hideValidate(this);
        }
        else showValidate(this);
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'username') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).addClass('active');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).removeClass('active');
            showPass = 0;
        }
        
    });


})(jQuery);
// "user1": {
//     "passwd":"user1",
//     "addr":"0x6794cDaf78d3f58CF33058ED6cf093B794967E0f",
//     "key":"2d99bdb3de5a2a1a546b0dc798d7b60e4501a081a3da48588dfe17e423cb62c9"
// };
function login() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('pass').value;

    console.log('LOGIN CLICKED');

    var data = JSON.stringify({'user': user, 'pass': pass});
    
    var xhr1 = new XMLHttpRequest();
    xhr1.open('POST', 'http://localhost:3000/login', true);
    xhr1.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr1.setRequestHeader('subject', 'CSE526');
    xhr1.send(data);

    console.log('fgvtbhjnmk');

    // xhr1.onreadystatechange = () => {
    //     if(xhr1.responseText) {
    //         console.log('readystatechange');
    //         console.log(xhr1.responseText);
    //     }
    // }
    
    xhr1.addEventListener('load', (r)=>{
        
        console.log(xhr1.status);
        if(xhr1.status == 200) {
            location.assign('http://localhost:3000/election');
            // res = JSON.parse(xhr1.responseText);
            // console.log(res);
            // var xhr2 = new XMLHttpRequest();
            // xhr2.open('GET', 'http://localhost:3000/election', true);
            // xhr2.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            // xhr2.setRequestHeader('subject', 'CSE526');
            // xhr2.send();
            // xhr2.addEventListener('load', (r)=>{
            //     // console.log(xhr2.responseText);
            //     document.write(xhr2.responseText);
            //     console.log();
            // });
        }
        else console.log('INCORRECT LOGIN');
    });


}

window.addEventListener("load", function () {
    var form = document.getElementById("myForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        login();
    });
});