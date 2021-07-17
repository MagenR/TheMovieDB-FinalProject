
// global vars ------------------------------------------------------------------------------------

key = "d8484ecfbfb906740724a447b5d63b12";
url = "https://api.themoviedb.org/";
imagePath = "https://image.tmdb.org/t/p/w500";
youtubeUrl = "https://www.youtube.com/embed/";

series = "";
seasonNum = "";
episodeNum = "";
episode = "";
tvId = "";

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    tvId = urlParams.get('id');

    GetTv(tvId);
    initOwl();

    $('#season').on('click', '.seasons', function () {
        seasonNum = $(this).attr('data-seasonNum');
        getSeason($(this).attr('data-seasonNum'));
        window.location.href = "#episodes";
    });

    $('#cast').on('click', '.personPicture', function () {
        $targetId = $(this).data('personid');
        window.location.href = "person.html?id=" + $targetId;
    });

    $('#episodes').on('click', '.episode', function () {
        episodeNum = $(this).data('episodenum');
        getEpisode($(this).data('seasonnum'), $(this).data('episodenum'));
        if (logged_user == null)
            $('#SaveEpisodeBtn').hide();
        else
            getCheckPreference(tvId, $(this).data('seasonnum'), $(this).data('episodenum'));
        $('#episodeModal').modal('show');
    });

    $('li .profile').click(function () {
        $logged_user = JSON.parse(localStorage.getItem('user'));
        window.location.href = "user.html?id=" + $logged_user.User_id;
    });

    $('#SaveEpisodeBtn').click(addEpisodePreference);
    $('#DiscussEpisodeBtn').click(function () {
        window.location.href = "episode.html?tv_id=" + tvId + "&season_num=" + episode.season_number + "&episode_num=" + episode.episode_number;
    })

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
            postEpisode();
        }

        function postSeriesErrorCB(msg) {
            getErrorCB(msg)
            postEpisode();
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

        function getEpisodeSuccessCB(episodeGet) {
            episode = episodeGet;
            renderEpisodeModal(episode);
        }

        //--------------------------------------- POST ------------------------------------

        function postEpisode() {

            let episodePost = {
                Tv_id: tvId,
                Season_number: episode.season_number,
                Episode_number: episode.episode_number,
                Episode_name: episode.name,
                Still_path: episode.still_path,
                Overview: episode.overview,
                Air_date: episode.air_date
            }

            let api = "../api/Episodes";

            ajaxCall("POST", api, JSON.stringify(episodePost), postEpisodeSuccessCB, postEpisodeErrorCB);
        }

        function postEpisodeSuccessCB(msg) {
            console.log(msg);
            postPreference();
        }
        function postEpisodeErrorCB(msg) {
            getErrorCB(msg)
            postPreference();
        }

    }

    // Preference -------------------------------------------------------------------------

    {
        // -------------------------------------- GET -------------------------------------
        function getCheckPreference(tvId, seasonNum, episodeNum) {

            let api = "../api/Preferences/Get";
            api += "?user_id=" + logged_user.User_id + "&series_id=" + tvId + "&season_id=" + seasonNum + "&episode_id=" + episodeNum;
            ajaxCall("GET", api, "", getCheckPreferenceSuccessCB, getCheckPreferenceErrorCB);
        }

        function getCheckPreferenceSuccessCB() {
            $('#SaveEpisodeBtn').hide();
        }

        function getCheckPreferenceErrorCB(err) {
            if (err.status == '404')
                $('#SaveEpisodeBtn').show();  
            getErrorCB(err);
        }

        //--------------------------------------- POST ------------------------------------

        function postPreference() {

            let epPreference = {
                Tv_id: tvId,
                Season_number: episode.season_number,
                Episode_number: episode.episode_number,
            }
            let preference = {
                UserPreference: logged_user,
                EpisodePreference: epPreference
            }

            let api = "../api/Preferences";

            ajaxCall("POST", api, JSON.stringify(preference), postPreferenceSuccessCB, getErrorCB);
        }

        function postPreferenceSuccessCB(msg) {
            console.log(msg);
            swal("Success!", msg, "success");
            $('#episodeModal').modal('hide');
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

    // Error call back ---------------------------------------------------------------------------

    function getErrorCB(err) {
        console.log("Error Status: " + err.status + " Message: " + err.responseJSON.Message);
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

function addEpisodePreference() {
    postTv();
}

// Renders-----------------------------------------------------------------------------------

{

    function renderTvSection(tv) {
        $('#header_section').css('background', 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8) ), url(' + imagePath + tv.backdrop_path + ')');
        $('#header_section').css('background-size', 'cover');
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

}
