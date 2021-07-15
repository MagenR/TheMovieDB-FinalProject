
// ---------------------------------------- Constroller functions--------------------------

$(document).ready(function () {
    key = "d8484ecfbfb906740724a447b5d63b12";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500";

    loadSavedLogIn();
    $("#showEpisodesBtn").click(getEpisodes);
    $("#goToInsert").click(function () {
        window.location.href = "../Pages/insert.html";
    });

});

// ----------------------------------------- Series -------------------------------------------

{

    // ----------------------------------------- GET ------------------------------------------

    function getSeriesNames() {
        let api = "../api/Series?user_id=" + logged_user.User_id;

        ajaxCall("GET", api, "", getSeriesNamesSuccessCB, getSeriesNamesErrorCB);
    }

    function getSeriesNamesSuccessCB(seriesList) {
        createSelect(seriesList);
    }

    function getSeriesNamesErrorCB(err) {
        console.log(err);
    }
}

// ----------------------------------------- Episodes -----------------------------------------

{
    // ----------------------------------------- GET ------------------------------------------

    function getEpisodes() {
        let tv_id = $("#seriesSelect").val();
        let api = "../api/Episodes?user_id=" + logged_user.User_id + "&tv_id=" + tv_id;
        ajaxCall("GET", api, "", getEpisodesSuccessCB, getEpisodesErrorCB);
    }

    // GET Callback on success.
    function getEpisodesSuccessCB(episodes) {
        renderEpisodes(episodes);
    }

    // GET Callback on failure.
    function getEpisodesErrorCB(err) {
        console.log(err);
    }
}

//--------------------------------------- Methods ---------------------------------------

function loadSavedLogIn() {
    logged_user = JSON.parse(localStorage.getItem('user'));
    if (logged_user != null)
        getSeriesNames();
}

function createSelect(seriesList) {
    for (let i = 0; i < seriesList.length; i++) {
        $('#seriesSelect').append($("<option></option>").attr("value", seriesList[i].Tv_id).text(seriesList[i].Name));
    }
}

function renderEpisodes(episodes) {
    $("#ph").html("");
    for (let i = 0; i < episodes.length; i++) {
        let date = new Date(episodes[i].Air_date)
        date = date.toLocaleDateString('he-IL');
        $("#ph").append(
            '<div class="card episode me-2" style="width: 18rem;">' +
            '<img class="card-img-top" src="' + imagePath + episodes[i].Still_path + '"/>' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + episodes[i].Episode_name + '</h5>' +
            '<p class="card-text"> Season number: ' + episodes[i].Season_number +
            '<p> Episode number: ' + episodes[i].Episode_number +
            '<p> Air date: ' + date +
            '<p> Overview: <br>' + episodes[i].Overview + '</p>' +
            '</div>' +
            '</div>');
    }

}
