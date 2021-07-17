logged_user = "";

$(document).ready(function () {
    /*
    $('#accessUserBtn').click(getUser);
    $('#logOutBtn').click(logOut);
    $('#signUpBtn').click(setMaxDate);
    $('#signUpModal').submit(signUp);
    */

    $("#passwordTB").on("blur", validatePassword);
    
    $('#logInModal').on('click', '#accessUserBtn', function () {
        getUser();
    });

    $('#loggedIn').on('click', '#logOutBtn', function () {
        logOut();
    });

    $('#signupLogin').on('click', '#signUpBtn', function () {
        setMaxDate();
    });

    $('#newUser').on('submit', '#signUpBtn', function () {
        signUp();
    });

    loadSavedLogIn();

});

// ---------------------------------------- API calls ---------------------------------------------
{

    // Users ---------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getUser() {
            let api = "../api/Users?email=" + $('#emailLogInTB').val() + "&password=" + $('#passwordLogInTB').val();
            ajaxCall("GET", api, "", getUserSuccessCB, getUserErrorCB);
        }

        function getUserSuccessCB(user) {
            logIn(user);
        }

        function getUserErrorCB(err) {
            console.log(err.status + " " + err.responseJSON.Message);
            if (err.status == '404')
                swal("Error!", "404: " + err.responseJSON.Message, "error");
            else
                swal("Error!", err.responseJSON.Message, "error");
        }

        //--------------------------------------- POST ------------------------------------

        function postUser() {

            let user = {
                First_name: $('#firstNameTB').val(),
                Last_name: $('#lastNameTB').val(),
                Email: $('#emailAddressTB').val(),
                Password: $('#passwordTB').val(),
                Phone_num: $('#phoneNumTB').val(),
                Address: $('#addressTB').val(),
                Fav_genre: $('#favGenreTB').val(),
                Gender: $('#genderDDL').val(),
                Birth_date: $('#birthYearTB').val()
            }

            let api = "../api/Users";
            ajaxCall("POST", api, JSON.stringify(user), postUserSuccessCB, postUserErrorCB);
        }

        function postUserSuccessCB(msg) {
            $('#signUpModal').modal('hide');
            swal("Success!", msg, "success");
        }

        function postUserErrorCB(err) {
            console.log(err.status + " " + err.responseJSON.Message);
            swal("Error!", err.responseJSON.Message, "error");
        }

    } // End of 'Users.

}

// ---------------------------------------- Functions ---------------------------------------------

function setMaxDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("birthYearTB").setAttribute("max", today);
}

// ---------------------------------------- User commands --------------------------------

function validatePassword() {

    let upper = /[A-Z]/;
    let number = /\d/;

    if (this.value.length < 6) {
        this.validity.valid = false;
        this.setCustomValidity("Please make sure password is atleast 6 characters.");
        return;
    }
    if (!number.test(this.value)) {
        this.validity.valid = false;
        this.setCustomValidity("Please make sure Password Includes a Digit");
        return;
    }
    if (!upper.test(this.value)) {
        this.validity.valid = false;
        this.setCustomValidity("Please make sure password includes an uppercase letter.");
        return;
    }
    else {
        this.validity.valid = true;
        this.setCustomValidity('');
    }
}

function signUp() {
    postUser();
    return false;
}

function loadSavedLogIn() {
    logged_user = JSON.parse(localStorage.getItem('user'));
    if (logged_user != null)
        logIn(logged_user);
    else
        $("#loggedIn").hide();
}

function logIn(user) {
    delete user.Password; // Remove password before saving to LS.
    localStorage.setItem('user', JSON.stringify(user));
    logged_user = JSON.parse(localStorage.getItem('user'));
    /* $("#WlcmMsg").html("Hello, " + user.First_name + " " + user.Last_name + "."); */
    $("#logInDropdown").html(user.First_name + " " + user.Last_name);
    $("#loggedIn").show();
    $("#signupLogin").hide();
    $('#logInModal').modal('hide');
}

function logOut() {
    /* $("#WlcmMsg").html(""); */
    $("#loggedIn").hide();
    $("#signupLogin").show();
    localStorage.clear();
    location.reload();
}
