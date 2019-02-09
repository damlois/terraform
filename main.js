function validateForm() {
    var name = document.forms["form"]["name"];
    var email = document.forms["form"]["email"];
    var age = document.forms["form"]["age"];

    if (name.value == ""){
        alert("please enter your name");
        name.focus();
        return false;
    }
    if (email.value == ""){
        alert("please enter your email");
        email.focus();
        return false;
    }
    if (age.value == ""){
        alert("please enter your age");
        age.focus();
        return false;
    }
}

