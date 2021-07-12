// global vars ------------------------------------------------------------------------------------

key = "d8484ecfbfb906740724a447b5d63b12";
url = "https://api.themoviedb.org/";
imagePath = "https://image.tmdb.org/t/p/w500";
maxResults = 6;

// ---------------------------------------- Controller functions-----------------------------------

$(document).ready(function () {

    $('#searchTvBtn').click(getSearchResults);
    $('#accessUserBtn').click(getUser);
    $('#logOutBtn').click(logOut);
    $('#signUpModal').submit(signUp);
    $("#passwordTB").on("blur", validatePassword);
    $('#ph').on('click', '.personPicture', function () {
        $targetId = $(this).data('personid');
        window.location.href = "person.html?id=" + $targetId;
    });
    /*.tvPoster: hover,*/

    setMaxDate();
    loadSavedLogIn();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParam = 'TV'; // Set Default param to users.
    urlParam = urlParams.get('category');

    if (urlParam == 'actors') {
        $('#searchBox').attr('placeholder', 'Search for an actor.')
        getActors();
        apiCallSearch = 'person';
        maxResults = 20;
    }
       
    else {
        getTrending();
        getOnAir();
        getPopular();
        getopRated();
        apiCallSearch = 'tv';
    }

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

    // Trending ------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getTrending() {
            let apiCall = url + "3/trending/tv/week?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getTrendingSuccessCB, getErrorCB)
        }

        function getTrendingSuccessCB(trending) {
            $('#ph').append('<div class="row trending"><h4>Trending this week</h4></div>');
            renderPosters("#ph .trending", trending, maxResults);
        }

    } // End of 'Trending.

    // On Air --------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getOnAir() {
            let apiCall = url + "3/tv/on_the_air?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getOnAirSuccessCB, getErrorCB)
        }

        function getOnAirSuccessCB(onAir) {
            $('#ph').append('<div class="row onAir"><h4>On Air</h4></div>');
            renderPosters("#ph .onAir", onAir, maxResults);
        }

    } // End of 'On Air'.

    // Popular -------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getPopular() {
            let apiCall = url + "3/tv/popular?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getPopularSuccessCB, getErrorCB)
        }

        function getPopularSuccessCB(popular) {
            $('#ph').append('<div class="row popular"><h4>Popular</h4></div>');
            renderPosters("#ph .popular", popular, maxResults);
        }

    } // End of 'Popular'.

    // Top Rated -----------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getopRated() {
            let apiCall = url + "3/tv/top_rated?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getopRatedSuccessCB, getErrorCB)
        }

        function getopRatedSuccessCB(topRated) {
            $('#ph').append('<div class="row topRated"><h4>Top Rated</h4></div>');
            renderPosters("#ph .topRated", topRated, maxResults)
        }

    } // End of 'Top Rated'.

    //  Actors/People ------------------------------------------------------------------------

    {
        function getActors() {
            let apiCall = url + "3/person/popular?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getPeopleSuccessCB, getErrorCB)
        }

        function getPeopleSuccessCB(popPeople) {
            $('#ph').append('<div class="row popularPeople"><h4>Popular People</h4></div>');
            renderPeople("#ph .popularPeople", popPeople, maxResults);
        }

    } // End of 'Actors/People'.

    // User Search ---------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getSearchResults() {
            let search = $('#searchBox').val()
            let apiCall = url + '3/search/' + apiCallSearch + '?api_key=' + key + '&query=' + search;
            ajaxCall("GET", apiCall, "", getSearchResultsSuccessCB, getErrorCB)
        }

        function getSearchResultsSuccessCB(SearchResults) {
            $('#ph').html('<div class="row search"></div>');
            $('#ph .search').append("<h4>Search Results</h4>");
            if (urlParam = 'actors')
                renderPeople("#ph .search", SearchResults, SearchResults.results.length);
            else
                renderPosters("#ph .search", SearchResults, SearchResults.results.length);
        }

    } // End of 'User Search'.

    // Error call back -----------------------------------------------------------------------

    function getErrorCB(err) {
        console.log("Error Status: " + err.status + " Message: " + err.Message);
    }

} // End of 'API calls'.

// ---------------------------------------- Functions ---------------------------------------------

{

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

    // ---------------------------------------- Renders --------------------------------------

    function renderPosters(location, source, totShow) {

        var posterPath = null;
        var seriesID = null;
        var seriesName = null;

        for (let i = 0; i < totShow; i++) {

            posterPath = source.results[i].poster_path;
            if (posterPath == null)
                posterPath = '../Images/placeholder-vertical.jpg';
            else
                posterPath = imagePath + posterPath;

            $(location).append('<div class="col-4 col-md-2 py-2 tvPoster"><img class="img-fluid popular rounded shadow" src="'
                + posterPath + '" data-seriesId="'
                + source.results[i].id + '"/>' + '<h5>'
                + source.results[i].name + '<h5>' + '</div>');
        }
    }

    function renderPeople(location, source, tot) {

        var profilePath = null;

        for (let i = 0; i < tot; i++) {

            profilePath = source.results[i].profile_path;
            if (profilePath == null)
                profilePath = '../Images/placeholder-vertical.jpg';
            else
                profilePath = imagePath + profilePath;

            $(location).append('<div class="col-4 col-md-2 py-2 personPicture" data-personid="' + source.results[i].id + '">'
                + '<img class="img-fluid popular rounded shadow" src="' + profilePath + '"/>'
                + '<h5>' + source.results[i].name + '<h5>'
                + '</div>');
        }
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
            $("#logOutBtn").hide();
    }

    function logIn(user) {
        delete user.Password; // Remove password before saving to LS.
        localStorage.setItem('user', JSON.stringify(user));
        $("#WlcmMsg").html("Hello, " + user.First_name + " " + user.Last_name + ".");
        $("#logOutBtn").show();
        $("#signUpBtn").hide();
        $("#logInBtn").hide();
        $('#logInModal').modal('hide');
    }

    function logOut() {
        $("#WlcmMsg").html("");
        $("#logOutBtn").hide();
        $("#signUpBtn").show();
        $("#logInBtn").show();
        localStorage.clear();
        location.reload();
    }

} // End of 'Functions'.
