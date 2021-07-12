// global vars ------------------------------------------------------------------------------------
    key = "d8484ecfbfb906740724a447b5d63b12";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500";

$(document).ready(function () {
    
    $('#tabs').on('click', '.moviesTab', function () {
        getPersonMovies(personId);
    });

    $('#tabs').on('click', '.TvTab', function () {
        getPersonTv(personId);
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    personId = urlParams.get('id');
    getPerson(personId);

});

// ---------------------------------------- API calls ---------------------------------------------

{

    // Person --------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------
        function getPerson(personId) {
            let apiCall = url + "3/person/" + personId + "?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getPersonSuccessCB, getErrorCB);
        }

        function getPersonSuccessCB(person) {
            $('#personPic').append('<img src="' + imagePath + person.profile_path + '"/>');
            $('#personName').append(person.name);
            $('#biography').append(person.biography);
            $('#known_for').append(person.known_for_department);

            let gender = 'male';
            if (person.gender == 1)
                gender = 'female'

            $('#gender').append(gender);
            $('#birthday').append(person.birthday);
            $('#place_of_birth').append(person.place_of_birth);
            getPersonMovies(personId);
        }

    }

    // Person in movies ----------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------
        function getPersonMovies(personId) {
            let apiCall = url + "3/person/" + personId + "/movie_credits?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getPersonInMovieSuccessCB, getErrorCB);
        }

        function getPersonInMovieSuccessCB(movie) {
            $('#movies').addClass("active");
            $('#tab img').remove();
            movies = movie.cast
            for (let i = 0; i < movies.length; i++) {
                $('#tab').append('<img class="card" src="' + imagePath + movies[i].poster_path + '"/>');
            }
        }

    }

    // Person in Tv --------------------------------------------------------------------------

    {
        //--------------------------------------- GET -------------------------------------
        function getPersonTv(personId) {
            let apiCall = url + "3/person/" + personId + "/tv_credits?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getPersonInTvSuccessCB, getErrorCB);
        }

        function getPersonInTvSuccessCB(tv) {
            $('#movies').removeClass("active");
            $('#tv').addClass("active");
            $('#tab img').remove();
            Tv = tv.cast
            for (let i = 0; i < Tv.length; i++) {
                $('#tab').append('<img class="card" src="' + imagePath + Tv[i].poster_path + '"/>');
            }
        }

    }

    // Error call back -----------------------------------------------------------------------

    function getErrorCB(err) {
        console.log("Error Status: " + err.status + " Message: " + err.Message);
    }

} // End of 'API calls'.