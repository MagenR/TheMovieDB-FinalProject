key = "d8484ecfbfb906740724a447b5d63b12";
url = "https://api.themoviedb.org/";
imagePath = "https://image.tmdb.org/t/p/w500";

$(function () {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    tv_id = urlParams.get('tv_id');
    season_num = urlParams.get('season_num');
    episode_num = urlParams.get('episode_num');

    getEpisode(tv_id, season_num, episode_num);
    initComments();
});

// API Calls --------------------------------------------------------------------------------------
{
    // Episode -----------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getEpisode(tv_id, season_num, episode_num) {
            let apiCall = url + "3/tv/" + tv_id + "/season/" + season_num + "/episode/" + episode_num + "?" + "api_key=" + key;
            ajaxCall("GET", apiCall, "", getEpisodeSuccessCB, getErrorCB)
        }

        function getEpisodeSuccessCB(episodeGet) {
            episode = episodeGet;
            renderEpisode(episode);
        }
    }

    // Error call back ---------------------------------------------------------------------------

    function getErrorCB(err) {
        console.log("Error Status: " + err.status + " Message: " + err.responseJSON.Message);
    }

}

// Renders-----------------------------------------------------------------------------------

function renderEpisode(episode) {
    $('#episodeName').html('Episode ' + episode_num + ' : ' + episode.name);
    $('#seasonNumber').html("Season: " + season_num);
    $('#airDate').html("Air date: " + episode.air_date);
    $('#overview').html(episode.overview);
    $('#still_image').attr("src", imagePath + episode.still_path);
}