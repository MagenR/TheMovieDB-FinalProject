
// ---------------------------------------- Constroller functions--------------------------

$(document).ready(function () {
    key = "d8484ecfbfb906740724a447b5d63b12";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500";

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    userId = urlParams.get('id');

    loadUserData(userId);
    initOwl();
    getSeriesFavs();

    $("#showEpisodesBtn").click(getEpisodes);

    $('#openImageUpload').click(selectImg);

    $('#seriesPanel').on('click', '.seriesTv', function () {
        getEpisodes($(this).attr('data-seriesid'));
    });
    /*
    $("#goToInsert").click(function () {
        window.location.href = "../Pages/insert.html";
    });
    */

});

// API Calls --------------------------------------------------------------------------------------

{
    // ----------------------------------------- Series Favs --------------------------------
    {
        // ----------------------------------------- GET ----------------------------------------

        function getUser(userId) {
            let api = "../api/Users?id=" + userId;

            ajaxCall("GET", api, "", getUserSuccessCB, getErrorCB);
        }

        function getUserSuccessCB(user) {
            return user;
        }
    }

    // ----------------------------------------- Series Favs --------------------------------

    {

        // ----------------------------------------- GET ----------------------------------------

        function getSeriesFavs() {
            let api = "../api/Series?user_id=" + logged_user.User_id;

            ajaxCall("GET", api, "", getSeriesFavsSuccessCB, getErrorCB);
        }

        function getSeriesFavsSuccessCB(seriesList) {
            buildSeries(seriesList);
        }

    }

    // ----------------------------------------- Episodes -----------------------------------------

    {
        // ----------------------------------------- GET ------------------------------------------

        function getEpisodes(tv_id) {
            let api = "../api/Episodes?user_id=" + logged_user.User_id + "&tv_id=" + tv_id;
            ajaxCall("GET", api, "", getEpisodesSuccessCB, getErrorCB);
        }

        function getEpisodesSuccessCB(episodes) {
            renderEpisodes(episodes);
        }

    }

    // ----------------------------------------- Error ------------------------------------------

    function getErrorCB(err) {
        console.log(err);
    }

}

//--------------------------------------- Functions -----------------------------------------------

function loadUserData(userId) {
    /*Compare logged user to query string id */
    logged_user = JSON.parse(localStorage.getItem('user'));
    if (logged_user != null) {
        if (logged_user.User_id == userId)
            appendUserData(logged_user);
        else {
            user = getUser(userId);
            appendUserData(user);
            /*hide upload picture button*/
            $('.profilePicBtn').hide();
        }
    }
}

function appendUserData(loggedUser) {
    $('#uName').html(loggedUser.First_name + ' ' + loggedUser.Last_name);
    $('#uEmail').html(loggedUser.Email);
    $('#uEmail').html(loggedUser.Email);
    $('#uPhone').html(loggedUser.Phone_num);
    $('#uPhone').html(loggedUser.Address);
    $('#uGenre').html(loggedUser.Fav_genre);
    $('#uGender').html(loggedUser.Gender);
    $('#uGender').html(loggedUser.Birth_date);
}

function selectImg() {
    $('#files').trigger('click');
    uploadImg();
}

function uploadImg() {
    var data = new FormData();
    file = $("#files").get(0).files;
    data.append("UploadedImage", file);

    $.ajax({
        type: "POST",
        url: "../Api/FileUpload",
        contentType: false,
        processData: false,
        data: data,
        success: showImage,
        error: error
    });
    return false;
}

function showImage() {
    console.log(data);
    $('.profilePic').attr("src", data);
}

function error(data) {
    console.log(data);
}


function buildSeries(series) {
    for (let i = 0; i < series.length; i++) {
        /*var seriesid = series[i].Tv_id;*/
        renderTv(series[i]);
    }
}

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

//------------------------------------------ Renders ----------------------------------------------

function renderTv(tv) {

    var posterPath = tv.Poster_path;

    if (posterPath == null)
        posterPath = '../Images/placeholder-vertical.jpg';
    else
        posterPath = imagePath + posterPath;

    var entry = '<div class="tvPoster seriesTv" data-seriesid="' + tv.Tv_id + '">'
        + '<img class="img-fluid popular rounded shadow" src="' + posterPath + '"/>'
        + '<h5>' + tv.Name + '</h5>'
        + '</div>';

    $('.owl-carousel').owlCarousel('add', entry).owlCarousel('update');
}

function renderEpisodes(episodes) {
    $("#episodes").html('');
    var posterPath = null;

    for (let i = 0; i < episodes.length; i++) {

        posterPath = episodes[i].Still_path;
        if (posterPath == null)
            posterPath = '../Images/no-image.png';
        else
            posterPath = imagePath + posterPath;

        $("#episodes").append('<div class="col-4 col-md-3 py-2 episode tvPoster" data-seasonNum="' + episodes[i].Season_number + '" data-episodeNum="' + episodes[i].Episode_number + '">'
            + '<img class="img-fluid popular rounded shadow" src="' + posterPath + '"/>'
            + '<h6>' + episodes[i].Episode_name + '</h6>'
            + '</div>');
    }

}