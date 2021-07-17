
// global vars ------------------------------------------------------------------------------------

key = "d8484ecfbfb906740724a447b5d63b12";
url = "https://api.themoviedb.org/";
imagePath = "https://image.tmdb.org/t/p/w500";

// ---------------------------------------- Constroller functions--------------------------

$(document).ready(function () {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    userId = urlParams.get('id');

    loadUserData(userId);

    initOwl();
    getSeriesFavs();
    showImage(userId);

    $('#uploadProfilePic').click(uploadImg);

    $('#seriesPanel').on('click', '.seriesTv', function () {
        getEpisodesUser($(this).attr('data-seriesid'));
    });

});

// API Calls --------------------------------------------------------------------------------------

{
    // ----------------------------------------- Series Favs --------------------------------
    {
        // ----------------------------------------- GET ----------------------------------------

        function getUserById(userId) {
            let api = "../api/Users?id=" + userId;

            ajaxCall("GET", api, "", getUserByIdSuccessCB, getErrorCB);
        }

        function getUserByIdSuccessCB(user) {
            appendUserData(user);
        }
    }

    // ----------------------------------------- Series Favs --------------------------------

    {

        // ----------------------------------------- GET ----------------------------------------

        function getSeriesFavs() {
            let api = "../api/Series?user_id=" + userId;

            ajaxCall("GET", api, "", getSeriesFavsSuccessCB, getErrorCB);
        }

        function getSeriesFavsSuccessCB(seriesList) {
            buildSeries(seriesList);
        }

    }

    // ----------------------------------------- Episodes -----------------------------------------

    {
        // ----------------------------------------- GET ------------------------------------------

        function getEpisodesUser(tv_id) {
            let api = "../api/Episodes?user_id=" + userId + "&tv_id=" + tv_id;
            ajaxCall("GET", api, "", getEpisodesUserSuccessCB, getErrorCB);
        }

        function getEpisodesUserSuccessCB(episodes) {
            renderEpisodes(episodes);
        }

    }

    // ----------------------------------------- Error ------------------------------------------

    function getErrorCB(err) {
        console.log("Error Status: " + err.status + " Message: " + err.responseJSON.Message)
    }

}

//--------------------------------------- Functions -----------------------------------------------

function loadUserData(userId) {

    logged_user = JSON.parse(localStorage.getItem('user'));
    if (logged_user != null && (logged_user.User_id == userId || userId == null))
        appendUserData(logged_user);
    else {
        user = getUserById(userId);
        $('#formUpload').hide();
    }
        
}

function appendUserData(user) {
    userId = user.User_id;
    var bday = new Date(user.Birth_date);
    bday = bday.toLocaleDateString('he-IL');
    $('#uName').html(user.First_name + ' ' + user.Last_name);

    switch (user.Gender) {
        case 'F': $('#uGender').html('Female'); break;
        case 'M': $('#uGender').html('Male'); break;
        default: $('#uGender').html('Other');
    }

    $('#uBirthday').html(bday);
    $('#uEmail').html(user.Email);
    $('#uPhone').html(user.Phone_num);
    $('#uAddress').html(user.Address);
    $('#uGenre').html(user.Fav_genre);     
}

function uploadImg() {
    var data = new FormData();
    var files = $('#profilePicInput').get(0).files;
    data.append('UploadedImage', files[0]);
    data.append('user_id', logged_user.User_id);

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

function showImage(user_id) {

    var profilePath = '../uploadedFiles/' + user_id + '.png';

    $.get(profilePath)
        .done(function () {
            $('#profilePic').attr("src", profilePath);
        }).fail(function () {
            $('#profilePic').attr("src", '../Images/profile-placeholder.jpg');
        })
}

function error(data) {
    console.log(data);
}

function buildSeries(series) {
    for (let i = 0; i < series.length; i++) {
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