
// global vars ------------------------------------------------------------------------------------

key = "d8484ecfbfb906740724a447b5d63b12";
url = "https://api.themoviedb.org/";
imagePath = "https://image.tmdb.org/t/p/w500";

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    personId = urlParams.get('id');
    getPerson(personId);
    getPersonTv(personId);

    $('#tv').on('click', '.tvPoster', function () {
        $targetId = $(this).data('seriesid');
        window.location.href = "series.html?id=" + $targetId;
    });
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
            $('#personPic').append('<img class="img-fluid rounded shadow" src="' + imagePath + person.profile_path + '"/>');
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
        //function getPersonMovies(personId) {
        //    let apiCall = url + "3/person/" + personId + "/movie_credits?" + "api_key=" + key;

        //    ajaxCall("GET", apiCall, "", getPersonInMovieSuccessCB, getErrorCB);
        //}

        //function getPersonInMovieSuccessCB(movie) {
        //    movies = movie.cast
        //    for (let i = 0; i < movies.length; i++) {
        //        $('#tab').append('<img class="card" src="' + imagePath + movies[i].poster_path + '"/>');
        //    }
        //}

    }

    // Person in Tv --------------------------------------------------------------------------

    {
        //--------------------------------------- GET -------------------------------------
        function getPersonTv(personId) {
            let apiCall = url + "3/person/" + personId + "/tv_credits?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getPersonInTvSuccessCB, getErrorCB);
        }

        function getPersonInTvSuccessCB(tv) {
            Tv = tv.cast
            for (let i = 0; i < Tv.length; i++) {
                posterPath = Tv[i].poster_path
                if (posterPath == null)
                    posterPath = '../Images/placeholder-vertical.jpg';
                else
                    posterPath = imagePath + posterPath;

                $("#tv").append('<div class="col-4 col-md-2 py-2 tvPoster" data-seriesid="' + Tv[i].id + '">'
                    + '<img class="img-fluid rounded shadow" src="' + posterPath + '"/>'
                    + '<h5>' + Tv[i].name + '</h5>'
                    + '</div>');
            }
        }
    }

    // Error call back -----------------------------------------------------------------------

    function getErrorCB(err) {
        console.log("Error Status: " + err.status + " Message: " + err.Message);
    }

} // End of 'API calls'.