
// ---------------------------------------- Constroller functions--------------------------

$(document).ready(function () {
    key = "d8484ecfbfb906740724a447b5d63b12";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500";

    loadUserData();
    initOwl();
    getSeriesFavs();
    
    $("#showEpisodesBtn").click(getEpisodes);

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

function loadUserData() {
    /*Compare logged user to query string id */

    /*logged_user = JSON.parse(localStorage.getItem('user'));*/
    /*if (logged_user != null)
        getSeriesNames();*/
    /* if logged user = query string id */
    /*appendUserData(this user);*/
    /* else - get user data ajax */
    /*appendUserData(query string id user);*/
    /*hide upload picture button*/

    /*read picture from file - if exists, else placeholder */
}

function appendUserData() {
    $('#uName').html(logged_user.First_name + ' ' + logged_user.Last_name);
    $('#uEmail').html(logged_user.Email);
    $('#uEmail').html(logged_user.Email);
    $('#uPhone').html(logged_user.Phone_num);
    $('#uPhone').html(logged_user.Address);
    $('#uGenre').html(logged_user.Fav_genre);
    $('#uGender').html(logged_user.Gender);
    $('#uGender').html(logged_user.Birth_date);
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