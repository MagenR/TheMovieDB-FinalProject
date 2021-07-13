key = "d8484ecfbfb906740724a447b5d63b12";
url = "https://api.themoviedb.org/";
imagePath = "https://image.tmdb.org/t/p/w500";
youtubeUrl = "https://www.youtube.com/embed/";

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    tvId = urlParams.get('id');

    GetTv(tvId);

    $('#season').on('click', '.seasons', function () {
        getSeason($(this).attr('data-seasonNum'));
    });

});

// Tv --------------------------------------------------------------------
{
    //--------------------------------------- GET -------------------------------------

    function GetTv(tvId) {
        let apiCall = url + "3/tv/" + tvId + "?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getTvSuccessCB, getErrorCB);
    }

    function getTvSuccessCB(tv) {
        $('#header_section').css('background', 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8) ), url(' + imagePath + tv.backdrop_path + ')');
        $('#header_section').css('background-size', 'cover');
        $('#navbarSeries').append(tv.name);
        $('#header').append(tv.name + "<br>");
        $('#overview').append(tv.overview);
        $('#backdrop_path').append("<img class='img-fluid  rounded-3  my-5' src='" + imagePath + tv.poster_path + "'/>");
        createdBy = tv.created_by;
        for (let i = 0; i < createdBy.length; i++) {
            $('#createdBy').append('<span class="red-star"> ★ </span>');
            $('#createdBy').append(createdBy[i].name);
        }
        renderSeasonsList(tv);
        getCast();
        getReviews();
        getVideos();
        getSimilarTv();
    }
}

function renderSeasonsList(tv) {
    seasons = tv.seasons;
    $('#season').append('<div class="row tvSeasons"><h4>Seasons:</h4></div>');
    var posterPath = null;

    for (let i = 0; i < seasons.length; i++) {

        posterPath = seasons[i].poster_path;
        if (posterPath == null)
            posterPath = '../Images/placeholder-vertical.jpg';
        else
            posterPath = imagePath + posterPath;

        $("#season .tvSeasons").append('<div class="col-4 col-md-2 py-2 tvPoster">'
            + '<img class="img-fluid seasons rounded shadow" src="' + posterPath + '" data-seasonNum="' + i + '"/>'
            + '<h5>' + seasons[i].name + '<h5>'
            + '</div>');
    }
}

// Series cast --------------------------------------------------------------------
{

    //--------------------------------------- GET -------------------------------------

    function getCast() {
        let apiCall = url + "3/tv/" + tvId + "/credits" + "?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getCastSuccessCB, getErrorCB);
    }

    function getCastSuccessCB(credit) {
        cast = credit.cast;
        $('#Cast').append('<div class="row popularPeople"><h4>Cast:</h4></div>');
        for (let i = 0; i < cast.length; i++) {
            personId = cast[i].id
            getPerson(personId);
        }
    }
}

function renderEpisodes(season) {
    $('#episodes').html('');
    episodes = season.episodes;
    $('#episodes_section').css('visibility', 'visible');
    $('#episodes').append('<div class="row tvSeasons"><h4>' + season.name + '</h4 ></div >');
    var posterPath = null;
    for (let i = 0; i < episodes.length; i++) {

        posterPath = episodes[i].still_path;
        if (posterPath == null)
            posterPath = '../Images/placeholder-vertical.jpg';
        else
            posterPath = imagePath + posterPath;

        $("#episodes .tvSeasons").append('<div class="col-4 col-md-2 py-2 tvPoster">'
            + '<img class="img-fluid popular rounded shadow" src="' + posterPath + '"/>'
            + '<h5>' + episodes[i].name + '<h5>'
            + '</div>');
    }
}

// Season episodes --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------

    function getSeason(seasonNum) {
        let apiCall = url + "3/tv/" + tvId + "/season/" + seasonNum + "?" + "api_key=" + key;
        ajaxCall("GET", apiCall, "", getSeasonSuccessCB, getErrorCB)
    }

    function getSeasonSuccessCB(season) {
        renderEpisodes(season);
    }

}

// Person --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------
    function getPerson() {
        let apiCall = url + "3/person/" + personId + "?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getPersonSuccessCB, getErrorCB);
    }

    function getPersonSuccessCB(person) {
        $("#Cast .popularPeople").append('<div class="col-4 col-md-2 py-2 personPicture">'
            + '<img class="img-fluid popular rounded shadow" src="' + imagePath + person.profile_path + '"/>'
            + '<h5>' + person.name + '<h5>'
            + '</div>');
    }
}

// Reviews --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------
    function getReviews() {
        let apiCall = url + "3/tv/" + tvId + "/reviews?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getReviewsSuccessCB, getErrorCB);
    }

    function getReviewsSuccessCB(reviews) {
        reviewsList = reviews.results;

        try {
            tbl = $('#reviewsTable').DataTable({
                data: reviewsList,
                pageLength: 5,
                columns: [
                    { data: "author" },
                    { data: "content" },
                    { data: "created_at" },
                    { data: "updated_at" },
                ],
            });
        }
        catch (err) {
            alert(err);
        }
    }

}

// Videos --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------
    function getVideos() {
        let apiCall = url + "3/tv/" + tvId + "/videos?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getVideosSuccessCB, getErrorCB);
    }

    function getVideosSuccessCB(video) {
        videos = video.results;
        $('#videos').append('<div class="row tvSeasons"><h4>Videos:</h4 ></div>');
        for (let i = 0; i < videos.length; i++) {
            $('#videos').append('<iframe width="400" height="300" src="' + youtubeUrl + videos[i].key + '"></iframe>');
        }
    }
}

// Similar Tv Shows --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------
    function getSimilarTv() {
        let apiCall = url + "3/tv/" + tvId + "/similar?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getSimilarSuccessCB, getErrorCB);
    }

    function getSimilarSuccessCB(similar) {
        similarTv = similar.results
        $('#similarTv').append('<div class="row Recommendations"><h4>Recommendations:</h4 ></div >');
        var posterPath = null;
        for (let i = 0; i < similarTv.length; i++) {

            posterPath = similarTv[i].poster_path;
            if (posterPath == null)
                posterPath = '../Images/placeholder-vertical.jpg';
            else
                posterPath = imagePath + posterPath;

            $("#similarTv .Recommendations").append('<div class="col-4 col-md-2 py-2 tvPoster">'
                + '<img class="img-fluid popular rounded shadow" src="' + posterPath + '"/>'
                + '<h5>' + similarTv[i].name + '<h5>'
                + '</div>');
        }

    }
}

// Error call back -----------------------------------------------------------------------

function getErrorCB(err) {
    console.log("Error Status: " + err.status + " Message: " + err.Message);
}