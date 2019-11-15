
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

//////////////////// LOGIN ////////////////////////////////////////////////////////////////////////////////////

function login() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('pass').value;

    console.log('LOGIN CLICKED');

    var data = JSON.stringify({'user': user, 'pass': pass});
    
    var xhr1 = new XMLHttpRequest();
    // xhr1.open('POST', 'http://localhost:3000/login', true);
    xhr1.open('POST', 'http://'+serverIP+':3000/login', true);
    xhr1.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr1.setRequestHeader('subject', 'CSE526');
    xhr1.send(data);

    console.log('request Sent! ');
    
    xhr1.addEventListener('load', (r)=>{
        
        console.log(xhr1.status);
        if(xhr1.status == 200) {
            if (localStorage.getItem("votePageLoad"))
                localStorage.removeItem("votePageLoad");
            // location.assign('http://localhost:3000/election');
            location.assign('http://'+serverIP+':3000/election');
        }
        else {
            toastr.error("Incorrect Username or Password", "Login failed!");
            console.log('INCORRECT LOGIN');
        }
    });
}

window.addEventListener("load", function () {
    // console.log('serverIP:', serverIP);
    var form = document.getElementById("loginForm");
    if(form)
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            login();
        });
});