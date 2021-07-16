key = "d8484ecfbfb906740724a447b5d63b12";
url = "https://api.themoviedb.org/";
imagePath = "https://image.tmdb.org/t/p/w500";
youtubeUrl = "https://www.youtube.com/embed/";

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    tvId = urlParams.get('id');

    GetTv(tvId);
    initOwl();

    $('#season').on('click', '.seasons', function () {
        getSeason($(this).attr('data-seasonNum'));
        window.location.href = "#episodes";
    });

    $('#cast').on('click', '.personPicture', function () {
        $targetId = $(this).data('personid');
        window.location.href = "person.html?id=" + $targetId;
    });

    $('#episodes').on('click', '.episode', function () {
        getEpisode($(this).data('seasonnum'), $(this).data('episodenum'));
        $('#episodeModal').modal('show');
    });

    $('#SaveEpisodeBtn').click(saveEp);

});

// API Calls --------------------------------------------------------------------------------------

{

    // Tv ----------------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function GetTv(tvId) {
            let apiCall = url + "3/tv/" + tvId + "?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getTvSuccessCB, getErrorCB);
        }

        function getTvSuccessCB(tv) {
            series = tv;
            document.title = tv.name;
            renderTvSection(tv);
            renderSeasonsList(tv);
            getCast();
            /*
            getReviews();
            getVideos();
            getSimilarTv();
            */
        }

        //--------------------------------------- POST --------------------------------------

        function postTv() {

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

    // Series cast -------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getCast() {
            let apiCall = url + "3/tv/" + tvId + "/credits" + "?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getCastSuccessCB, getErrorCB);
        }

        function getCastSuccessCB(credit) {
            var cast = credit.cast;
            buildCast(cast);
        }

    }

    // Season episodes ---------------------------------------------------------------------------

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

    // Episode -----------------------------------------------------------------------------------

    {
        //--------------------------------------- GET -------------------------------------

        function getEpisode(seasonNum, episodeNum) {
            let apiCall = url + "3/tv/" + tvId + "/season/" + seasonNum + "/episode/" + episodeNum + "?" + "api_key=" + key;
            ajaxCall("GET", apiCall, "", getEpisodeSuccessCB, getErrorCB)
        }

        function getEpisodeSuccessCB(episode) {
            logged_user = JSON.parse(localStorage.getItem('user'));
            episodeList = getSavedEpisode(logged_user.User_id, tvId);
            for (let i = 0; i < episodeList.length; i++) {
                if (episodeList[i].episode_number == episode.episode_number)
                    renderEpisodeModal(episode);
                    ('#SaveEpisodeBtn').removeAttr('disabled');
            }
            renderEpisodeModal(episode);
            episodeToAdd = episode.episode_number;
        }

        //--------------------------------------- POST ------------------------------------

        function postEpisode(epNum) {

            episode = {
                Tv_id: tvId,
                Season_number: episodes[epNum].season_number,
                Episode_number: episodes[epNum].episode_number,
                Episode_name: episodes[epNum].name,
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

    // Saved Episode -----------------------------------------------------------------------------------

    {
        //--------------------------------------- GET -------------------------------------
        function getSavedEpisode(userId, TvId) {
            let api = "../api/Episodes?user_id=" + userId + "&tv_id=" + TvId;

            ajaxCall("GET", api, "", getSavedEpisodeSuccessCB, getErrorCB);
        }

        function getSavedEpisodeSuccessCB(savedEpisodes) {
            return savedEpisodes;
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
            $('#episodeModal').modal('hide');
        }

        function postPreferenceErrorCB(err) {
            console.log(err.status + " " + err.responseJSON.Message);
        }

    }

    // Person ------------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getPerson(personId) {
            let apiCall = url + "3/person/" + personId + "?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getPersonSuccessCB, getErrorCB);
        }

        function getPersonSuccessCB(person) {
            renderPerson(person);
        }

    }

    // Reviews -----------------------------------------------------------------------------------

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

    // Videos ------------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------
        function getVideos() {
            let apiCall = url + "3/tv/" + tvId + "/videos?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getVideosSuccessCB, getErrorCB);
        }

        function getVideosSuccessCB(video) {
            videos = video.results;
            renderVideos(video);
        }

    }

    // Similar Tv Shows --------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getSimilarTv() {
            let apiCall = url + "3/tv/" + tvId + "/similar?" + "api_key=" + key;

            ajaxCall("GET", apiCall, "", getSimilarSuccessCB, getErrorCB);
        }

        function getSimilarSuccessCB(similar) {
            similarTv = similar.results;
            renderSimilarTv(similarTv);
        }

    }

    // Error call back ---------------------------------------------------------------------------

    function getErrorCB(err) {
        console.log("Error Status: " + err.status + " Message: " + err.Message);
    }

}

// Functions --------------------------------------------------------------------------------------

function initOwl() {
    $owl = $(".owl-carousel").owlCarousel({
        margin: 10,
        dots: true,
        nav: true,
        responsive: {
            0: {
                items: 3
            },
            600: {
                items: 4
            },
            1000: {
                items: 6
            }
        }
    });
}

function buildCast(cast) {
    for (let i = 0; i < cast.length; i++) {
        var personId = cast[i].id;
        getPerson(personId);
    }
}

function saveEp() {
    postTv();
}

// Renders-----------------------------------------------------------------------------------

{

    function renderTvSection(tv) {
        $('#header_section').css('background', 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8) ), url(' + imagePath + tv.backdrop_path + ')');
        $('#header_section').css('background-size', 'cover');
        /* $('#navbarSeries').append(tv.name); */
        $('#header').append(tv.name + "<br>");
        $('#overview').append(tv.overview);
        $('#backdrop_path').append('<img class="img-fluid rounded-3 my-5" src="' + imagePath + tv.poster_path + '"/>');
        createdBy = tv.created_by;
        for (let i = 0; i < createdBy.length; i++) {
            $('#createdBy').append('<span class="red-star"> ★ </span>');
            $('#createdBy').append(createdBy[i].name);
        }
    }

    function renderSeasonsList(tv) {
        seasons = tv.seasons;
        var posterPath = null;
        /*
        for (let i = seasons[0].season_number; i < seasons.length; i++) {

            posterPath = seasons[i].poster_path;
            if (posterPath == null)
                posterPath = '../Images/placeholder-vertical.jpg';
            else
                posterPath = imagePath + posterPath;

            $("#season").append('<div class="col-4 col-md-2 py-2 tvPoster">'
                + '<img class="img-fluid seasons rounded shadow" src="' + posterPath + '" data-seasonNum="' + i + '"/>'
                + '<h5>' + seasons[i].name + '</h5>'
                + '</div>');
        }
        */
        seasons.forEach(function (season) {
            posterPath = season.poster_path;
            if (posterPath == null)
                posterPath = '../Images/placeholder-vertical.jpg';
            else
                posterPath = imagePath + posterPath;

            $("#season").append('<div class="col-4 col-md-2 py-2 tvPoster">'
                + '<img class="img-fluid seasons rounded shadow" src="' + posterPath + '" data-seasonNum="' + season.season_number + '"/>'
                + '<h5>' + season.name + '</h5>'
                + '</div>');
        });

    }

    function renderEpisodes(season) {
        episodes = season.episodes;
        var posterPath = null;

        $('#episodes').html('<h4>' + season.name + ' Episodes: </h4>');
        $('#episodes_section').css('visibility', 'visible');

        for (let i = 0; i < episodes.length; i++) {

            posterPath = episodes[i].still_path;
            if (posterPath == null)
                posterPath = '../Images/no-image.png';
            else
                posterPath = imagePath + posterPath;

            $("#episodes").append('<div class="col-4 col-md-2 py-2 episode tvPoster" data-seasonNum="' + season.season_number + '" data-episodeNum="' + episodes[i].episode_number + '">'
                + '<img class="img-fluid popular rounded shadow" src="' + posterPath + '"/>'
                + '<h5> Episode ' + (i + 1) + ': ' + episodes[i].name + '</h5>'
                + '</div>');
        }
    }

    function renderPerson(person) {

        var posterPath = person.profile_path

        if (posterPath == null)
            posterPath = '../Images/placeholder-vertical.jpg';
        else
            posterPath = imagePath + posterPath;

        var entry = '<div class="personPicture" data-personid="' + person.id + '">'
            + '<img class="img-fluid popular rounded shadow" src="' + posterPath + '"/>'
            + '<h5>' + person.name + '</h5>'
            + '</div>';

        $('.owl-carousel').owlCarousel('add', entry).owlCarousel('update');
    }

    function renderEpisodeModal(episode) {
        $('#episodeModal .modal-title').html(episode.name);
        $('#episodeModal .modal-body img').attr("src", imagePath + episode.still_path);
        $('#episodeModal .modal-body .air-date').html(episode.air_date);
        $('#episodeModal .modal-body .episode-overview').html(episode.overview);
    }
    /*
    function renderVideos(videos) {
        $('#videos').append('<div class="row tvSeasons"><h4>Videos:</h4 ></div>');
        for (let i = 0; i < videos.length; i++)
            $('#videos').append('<iframe width="400" height="300" src="' + youtubeUrl + videos[i].key + '"></iframe>');
    }

    function renderSimilarTv(similarTv) {
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
    */

}
