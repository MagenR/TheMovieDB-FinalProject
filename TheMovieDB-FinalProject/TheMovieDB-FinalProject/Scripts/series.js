$(document).ready(function () {
    key = "d8484ecfbfb906740724a447b5d63b12";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500";
    youtubeUrl = "https://www.youtube.com/embed/";
    renderSeries();

    $('#seasons').on('click', '.season', function () {
        getSeason($(this).attr('data-seasonNum'));
    });
});


function renderSeries() {
    series = JSON.parse(window.localStorage.getItem('series'));
    $('#header_section').css('background', 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8) ), url(' + imagePath + series.backdrop_path + ')');
    $('#header_section').css('background-size', 'cover');
    $('#navbarSeries').append(series.name);
    $('#header').append(series.name + "<br>");
    $('#overview').append(series.overview);
    $('#backdrop_path').append("<img class='img-fluid  rounded-3  my-5' src='" + imagePath + series.poster_path + "'/>");
    $('#vote_average').append(series.vote_average);
    $('#origin_country').append(series.origin_country);
    $('#original_language').append(series.original_language);
    $('#original_name').append(series.original_name);
    renderSeasonsList();
    renderCast();
    getReviews();
    getVideos();
    getSimilarTv();
}

function renderSeasonsList() {
    seasons = JSON.parse(window.localStorage.getItem('seasons'));
    for (let i = 0; i < seasons.length; i++) {
        $("#seasons").append('<div class="card"> <img class="season" src="' + imagePath + seasons[i].poster_path + '" data-seasonNum="' + (i + 1) + '"/></div>');
    }
}

function renderCast() {
    cast = JSON.parse(window.localStorage.getItem('cast'));
    for (let i = 0; i < cast.length; i++) {
        personId = cast[i].id
        getPerson(personId);
    }
}

function renderEpisodes(season) {
    $('.episode').remove();
    episodes = season.episodes;
    $('#episodes_section').css('visibility', 'visible');
    $("#episodes").append('<h2 class="fw-bolder episode">' + season.name + '</h2>');
    for (let i = 0; i < episodes.length; i++) {
        $("#episodes").append('<div class="card"> <img class="episode" src="' + imagePath + episodes[i].still_path +
            '"/><p class= "small text-left episode card-body">' + episodes[i].name + '<br>' + episodes[i].overview + '</p></div>');

    }
}

// Season episodes --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------

    function getSeason(seasonNum) {
        let apiCall = url + "3/tv/" + series.id + "/season/" + seasonNum + "?" + "api_key=" + key;
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

// Person --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------
    function getPerson() {
        let apiCall = url + "3/person/" + personId + "?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getPersonSuccessCB, getPersonErrorCB);
    }

    function getPersonSuccessCB(person) {
        $("#cast").append('<div class="card"> <img class="cast" src="' + imagePath + person.profile_path +
            '"/><p class= "small text-muted">' + person.name + '</p></div>');
    }

    function getPersonErrorCB(err) {
        console.log(err.status + " " + err.responseJSON.Message);
    }
}

// Reviews --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------
    function getReviews() {
        let apiCall = url + "3/tv/" + series.id + "/reviews?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getReviewsSuccessCB, getReviewsErrorCB);
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

    function getReviewsErrorCB(err) {
        console.log(err.status + " " + err.responseJSON.Message);
    }
}

// Videos --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------
    function getVideos() {
        let apiCall = url + "3/tv/" + series.id + "/videos?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getVideosSuccessCB, getVideosErrorCB);
    }

    function getVideosSuccessCB(video) {
        videos = video.results;
        for (let i = 0; i < videos.length; i++) {
            $('#videos').append('<iframe width="400" height="300" src="' + youtubeUrl + videos[i].key + '"></iframe>');
        }
    }

    function getVideosErrorCB(err) {
        console.log(err.status + " " + err.responseJSON.Message);
    }
}

// Similar Tv Shows --------------------------------------------------------------------

{
    //--------------------------------------- GET -------------------------------------
    function getSimilarTv() {
        let apiCall = url + "3/tv/" + series.id + "/similar?" + "api_key=" + key;

        ajaxCall("GET", apiCall, "", getSimilarSuccessCB, getSimilarErrorCB);
    }

    function getSimilarSuccessCB(similar) {
        similarTv = similar.results;
        for (let i = 0; i < similarTv.length; i++) {
            $("#Recommendations").append('<div class="card"> <img class="similarTv" src="' + imagePath + similarTv[i].poster_path +
                '"/><br><p class= "small text-muted">' + similarTv[i].name + '</p><p class= "small text-muted">' + (similarTv[i].vote_average) * 10 + '%</p></div>');
        }
    }

    function getSimilarErrorCB(err) {
        console.log(err.status + " " + err.responseJSON.Message);
    }
}