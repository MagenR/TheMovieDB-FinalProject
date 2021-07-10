
// ---------------------------------------- Constroller functions--------------------------

$(document).ready(function () {
    $("#getTV").click(getTV);
    $("#getEps").click(function () {
        window.location.href = "../Pages/view.html";
    });

    $('#ph').on('click', '.season', function () {
        getSeason($(this).attr('data-seasonNum'));
    });

    $('#ph').on('click', '.episode-btn', function () {
        episodeToAdd = parseInt($(this).attr('data-episodeNum'));
        postSeries();
    });

    $('#logInModal').on('click', '#accessUserBtn', function () {
        getUser();
    });

    $('#signUpModal').submit(signUp);

    $('.navbar').on('click', '#logOutBtn', function () {
        logOut();
    });

    $("#passwordTB").on("blur", validatePassword);
    loadSavedLogIn();
    setMaxDate();


    key = "d8484ecfbfb906740724a447b5d63b12";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500";
});

// ---------------------------------------- API calls -------------------------------------
{

    // Users ------------------------------------------------------------------------------

    {

        //--------------------------------------- GET ---------------------------------------

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

        //--------------------------------------- POST --------------------------------------

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
    }

    // Series -----------------------------------------------------------------------------

    {

        //--------------------------------------- GET ---------------------------------------

        function getTV() {
            let name = $("#tvShowName").val();
            let method = "3/search/tv?";
            let api_key = "api_key=" + key;
            let moreParams = "&language=en-US&page=1&include_adult=false&";
            let query = "query=" + encodeURIComponent(name);
            let apiCall = url + method + api_key + moreParams + query;

            ajaxCall("GET", apiCall, "", getTVSuccessCB, getTVErrorCB);
        }

        function getTVSuccessCB(tv) {
            series = tv.results[0];
            tvId = series.id;
            renderTV(series);
        }

        function getTVErrorCB(err) {
            console.log(err.status + " " + err.responseJSON.Message);
        }

        //--------------------------------------- POST --------------------------------------

        function postSeries() {

            tv_series = {
                tv_id: series.id,
                first_air_date: series.first_air_date,
                name: series.name,
                origin_country: series.origin_country[0],
                original_language: series.original_language,
                overview: series.overview,
                popularity: series.popularity,
                poster_path: series.poster_path
            }

            let api = "../api/Series";

            ajaxCall("POST", api, JSON.stringify(tv_series), postSeriesSuccessCB, postSeriesErrorCB);
        }

        function postSeriesSuccessCB(msg) {
            console.log(msg);
            postEpisode(episodeToAdd);
        }

        function postSeriesErrorCB(err) {
            console.log(err.status + " " + err.responseJSON.Message);
            postEpisode(episodeToAdd);
        }
    }

    // Seasons ----------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getSeasons() {

            let method = "3/tv/";
            let api_key = "api_key=" + key;
            let apiCall = url + method + tvId + "?" + api_key;

            ajaxCall("GET", apiCall, "", getSeasonsSuccessCB, getSeasonsErrorCB);
        }

        function getSeasonsSuccessCB(seasons) {
            renderSeasonsList(seasons);
        }

        function getSeasonsErrorCB(err) {
            console.log(err.status + " " + err.responseJSON.Message);
        }
    }

    // Season episodes --------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getSeason(seasonNum) {
            let apiCall = url + "3/tv/" + tvId + "/season/" + seasonNum + "?" + "api_key=" + key;
            seasonNumber = seasonNum;
            ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getSeasonErrorCB)
        }

        function getSeasonSuccessCB(episodes) {
            renderEpisodes(episodes);
        }

        function getSeasonErrorCB(err) {
            if (seasonNumber == 0)
                getSeason(1);
            else
                console.log(err.status + " " + err.responseJSON.Message);
        }
    }

    // Episode ----------------------------------------------------------------------------

    {

        //--------------------------------------- POST ------------------------------------

        function postEpisode(epNum) {

            episode = {
                Tv_id: tvId,
                Season_number: episodes[epNum].season_number,
                Episode_number: episodes[epNum].episode_number,
                Name: episodes[epNum].name,
                Still_path: episodes[epNum].still_path,
                Overview: episodes[epNum].overview,
                Air_date: episodes[epNum].air_date
            }

            let api = "../api/Episodes";

            ajaxCall("POST", api, JSON.stringify(episode), postEpisodeSuccessCB, postEpisodeErrorCB);
        }

        function postEpisodeSuccessCB(msg) {
            console.log(msg);
            postPreference();
        }

        function postEpisodeErrorCB(err) {
            console.log(err.status + " " + err.responseJSON.Message);
            postPreference();
        }
    }

    // Preference -------------------------------------------------------------------------

    {

        //--------------------------------------- POST ------------------------------------

        function postPreference() {

            let preference = {
                UserPreference: logged_user,
                EpisodePreference: episode
            }

            let api = "../api/Preferences";

            ajaxCall("POST", api, JSON.stringify(preference), postPreferenceSuccessCB, postPreferenceErrorCB);
        }


        function postPreferenceSuccessCB(msg) {
            console.log(msg);
        }

        function postPreferenceErrorCB(err) {
            console.log(err.status + " " + err.responseJSON.Message);
        }

    }

}

// ---------------------------------------- Functions -------------------------------------

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

    function renderSeasonsList(tv) {
        $("#ph").html("");
        seasons = tv.seasons;
        for (let i = 0; i < seasons.length; i++) {
            $("#ph").append('<img class="season" src="' + imagePath + seasons[i].poster_path + '" data-seasonNum="' + i + '"/>');
        }
    }

    function renderEpisodes(season) {
        $("#ph").html("");
        episodes = season.episodes;
        for (let i = 0; i < episodes.length; i++) {

            $("#ph").append(
                '<div class="card episode me-2" style="width: 18rem;">' +
                '<img class="card-img-top" src="' + imagePath + episodes[i].still_path + '"/>' +
                '<div class="card-body">' +
                '<h5 class="card-title">' + episodes[i].name + '</h5>' +
                '<p class="card-text">' + episodes[i].overview + '</p>' +
                '<p> air date: ' + episodes[i].air_date + '</p>' +
                '<button type="button" class="episode-btn" data-episodeNum="' + i + '">Add this episode</button>' +
                '</div>' +
                '</div>'
            );

        }
    }

    function renderTV(tv) {
        $("#series_page").html("");
        $("#series_page").append(
            "<img src='" + imagePath + tv.poster_path + "'/>" +
            "<h2>" + tv.name + "</h2>" +
            "<p> Vote average: " + tv.vote_average + "<p>" +
            "<p> Origin country: " + tv.origin_country + "<p>" +
            "<p> Original language: " + tv.original_language + "<p>" +
            "<p> Original name: " + tv.original_name + "<p>" +
            "<p>" + tv.overview + "</p>");
        getSeasons(tv.id);
    }

    // User commands

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
        $('#getTV').prop("disabled", false);
        $('#getEps').prop("disabled", false);
        $('#tvShowName').prop("disabled", false);
        $('#logInModal').modal('hide');
    }

    function logOut() {
        $("#logOutBtn").hide();
        $("#WlcmMsg").html("The Movie DB Project");
        $("#signUpBtn").show();
        $("#logInBtn").show();
        $('#getTV').prop("disabled", true);
        $('#getEps').prop("disabled", true);
        $('#tvShowName').val('');
        $('#tvShowName').prop("disabled", true);
        localStorage.clear();
        $('#ph').empty();
    }
}
