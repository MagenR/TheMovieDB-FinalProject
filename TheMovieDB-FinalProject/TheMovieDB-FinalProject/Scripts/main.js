
// global vars ------------------------------------------------------------------------------------

key = "d8484ecfbfb906740724a447b5d63b12";
url = "https://api.themoviedb.org/";
imagePath = "https://image.tmdb.org/t/p/w500";
maxResults = 6;
total_pages = "";
pageNum = 1;
// ---------------------------------------- Controller functions-----------------------------------

$(document).ready(function () {

    $('#searchTvBtn').click(getSearchResults);

    $('#ph').on('click', '.personPicture', function () {
        $targetId = $(this).data('personid');
        window.location.href = "person.html?id=" + $targetId;
    });
    $('#ph').on('click', '.tvPoster', function () {
        $targetId = $(this).data('seriesid');
        window.location.href = "series.html?id=" + $targetId;
    });

    $('li .profile').click(function () {
        $logged_user = JSON.parse(localStorage.getItem('user'));
        window.location.href = "user.html?id=" + $logged_user.User_id;
    });

    $('#paginationNavigation').on('click', '.paginationBtn', function () {
        pageNum = $(this).data('page');
        getSearchPageResults();
        printPagination();
    });

    $('#paginationNavigation').on('click', '.prevPaginationBtn', function () {
        --pageNum;
        getSearchPageResults();
        printPagination();
    });

    $('#paginationNavigation').on('click', '.nextPaginationBtn', function () {
        ++pageNum;
        getSearchPageResults();
        printPagination();
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParam = urlParams.get('category');

    if (urlParam == 'actors') {
        $('#searchBox').attr('placeholder', 'Search for an actor.')
        getActors();
        apiCallSearch = 'person';
        maxResults = 20;
    }

    else {
        getTrending();
        getOnAir();
        getPopular();
        getopRated();
        urlParam = 'tv'
        apiCallSearch = 'tv';
    }

});

// ---------------------------------------- API calls ---------------------------------------------

{

    // Trending ------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getTrending() {
            let apiCall = url + "3/trending/tv/week?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getTrendingSuccessCB, getErrorCB)
        }

        function getTrendingSuccessCB(trending) {
            $('#ph').append('<div class="row trending"><h4>Trending this week</h4></div>');
            renderPosters("#ph .trending", trending, maxResults);
        }

    } // End of 'Trending.

    // On Air --------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getOnAir() {
            let apiCall = url + "3/tv/on_the_air?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getOnAirSuccessCB, getErrorCB)
        }

        function getOnAirSuccessCB(onAir) {
            $('#ph').append('<div class="row onAir"><h4>On Air</h4></div>');
            renderPosters("#ph .onAir", onAir, maxResults);
        }

    } // End of 'On Air'.

    // Popular -------------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getPopular() {
            let apiCall = url + "3/tv/popular?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getPopularSuccessCB, getErrorCB)
        }

        function getPopularSuccessCB(popular) {
            $('#ph').append('<div class="row popular"><h4>Popular</h4></div>');
            renderPosters("#ph .popular", popular, maxResults);
        }

    } // End of 'Popular'.

    // Top Rated -----------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getopRated() {
            let apiCall = url + "3/tv/top_rated?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getopRatedSuccessCB, getErrorCB)
        }

        function getopRatedSuccessCB(topRated) {
            $('#ph').append('<div class="row topRated"><h4>Top Rated</h4></div>');
            renderPosters("#ph .topRated", topRated, maxResults)
        }

    } // End of 'Top Rated'.

    //  Actors/People ------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getActors() {
            let apiCall = url + "3/person/popular?api_key=" + key + "&page=1";
            ajaxCall("GET", apiCall, "", getPeopleSuccessCB, getErrorCB)
        }

        function getPeopleSuccessCB(popPeople) {
            $('#ph').append('<div class="row popularPeople"><h4>Popular People</h4></div>');
            renderPeople("#ph .popularPeople", popPeople, maxResults);
        }

    } // End of 'Actors/People'.

    // User Search ---------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getSearchResults() {
            let search = $('#searchBox').val()
            let apiCall = url + '3/search/' + apiCallSearch + '?api_key=' + key + '&query=' + search;
            ajaxCall("GET", apiCall, "", getSearchResultsSuccessCB, getErrorCB)
        }

        function getSearchResultsSuccessCB(SearchResults) {
            total_pages = SearchResults.total_pages;
            pageNum = 1;
            printPagination();
            $('#ph').html('<div class="row search"></div>');
            $('#ph .search').append("<h4>Search Results</h4>");
            if (urlParam == 'actors')
                renderPeople("#ph .search", SearchResults, SearchResults.results.length);
            else
                renderPosters("#ph .search", SearchResults, SearchResults.results.length);
        }

    } // End of 'User Search'.

    // User Search Pages---------------------------------------------------------------------------

    {

        //--------------------------------------- GET -------------------------------------

        function getSearchPageResults() {
            let search = $('#searchBox').val()
            let apiCall = url + '3/search/' + apiCallSearch + '?api_key=' + key + '&query=' + search + '&page=' + pageNum;
            ajaxCall("GET", apiCall, "", getSearchPageResultsSuccessCB, getErrorCB)
        }

        function getSearchPageResultsSuccessCB(SearchResults) {
            $('#ph').html('<div class="row search"></div>');
            $('#ph .search').append("<h4>Search Results</h4>");
            if (urlParam == 'actors')
                renderPeople("#ph .search", SearchResults, SearchResults.results.length);
            else
                renderPosters("#ph .search", SearchResults, SearchResults.results.length);
        }

    } // End of 'User Search'.

    // Error call back -----------------------------------------------------------------------

    function getErrorCB(err) {
        console.log("Error Status: " + err.status + " Message: " + err.responseJSON.Message)
    }

} // End of 'API calls'.

// ---------------------------------------- Functions ---------------------------------------------

{

    // ---------------------------------------- Renders --------------------------------------

    function renderPosters(location, source, totShow) {

        var posterPath = null;
        var seriesID = null;
        var seriesName = null;

        for (let i = 0; i < totShow; i++) {

            posterPath = source.results[i].poster_path;
            if (posterPath == null)
                posterPath = '../Images/placeholder-vertical.jpg';
            else
                posterPath = imagePath + posterPath;

            $(location).append('<div class="col-4 col-md-2 py-2 tvPoster" data-seriesid="' + source.results[i].id + '">'
                + '<img class="img-fluid popular rounded shadow" src="' + posterPath + '"/>'
                + '<h5>' + source.results[i].name + '<h5>'
                + '</div>');
        }

    }
}

function renderPeople(location, source, tot) {

    var profilePath = null;

    for (let i = 0; i < tot; i++) {

        profilePath = source.results[i].profile_path;
        if (profilePath == null)
            profilePath = '../Images/placeholder-vertical.jpg';
        else
            profilePath = imagePath + profilePath;

        $(location).append('<div class="col-4 col-md-2 py-2 personPicture" data-personid="' + source.results[i].id + '">'
            + '<img class="img-fluid popular rounded shadow" src="' + profilePath + '"/>'
            + '<h5>' + source.results[i].name + '<h5>'
            + '</div>');
    }
}

function printPagination() {
    $('#paginationNavigation').html("");
    if (total_pages > 1) {
        paginationStr =
            '<nav>' +
            '<ul class="pagination justify-content-center">' +
            '<li class="page-item prevPaginationBtn">' +
            '<a class="page-link" href="#">Previous</a>' +
            '</li>';
        if (pageNum <= 5) {
            for (let i = (pageNum - pageNum) + 1; i < pageNum; i++) {
                paginationStr +=
                    '<li class="page-item paginationBtn" data-page="' + i + '">' +
                    '<a class= "page-link" href ="#">' + i + '</a>' +
                    '</li>';
            }
            paginationStr +=
                '<li class="page-item active paginationBtn" aria-current="page" data-page="' + pageNum + '">' +
                '<a class= "page-link" href ="#">' + pageNum + '</a>' +
                '</li>';
            if (total_pages > 10)
                total = 10;
            else total = total_pages;
            for (let i = pageNum + 1; i <= total; i++) {
                paginationStr +=
                    '<li class="page-item paginationBtn" data-page="' + i + '">' +
                    '<a class= "page-link" href ="#">' + i + '</a>' +
                    '</li>';
            }
        }
        else if (pageNum <= total_pages - 5) {
            for (let i = pageNum - 5; i < pageNum; i++) {
                paginationStr +=
                    '<li class="page-item paginationBtn" data-page="' + i + '">' +
                    '<a class= "page-link" href ="#">' + i + '</a>' +
                    '</li>';
            }
            paginationStr +=
                '<li class="page-item active paginationBtn" aria-current="page" data-page="' + pageNum + '">' +
                '<a class= "page-link" href ="#">' + pageNum + '</a>' +
                '</li>';
            for (let i = pageNum + 1; i < pageNum + 5; i++) {
                paginationStr +=
                    '<li class="page-item paginationBtn" data-page="' + i + '">' +
                    '<a class= "page-link" href ="#">' + i + '</a>' +
                    '</li>';
            }
        }
        else {
            for (let i = pageNum - 5; i < pageNum; i++) {
                paginationStr +=
                    '<li class="page-item paginationBtn" data-page="' + i + '">' +
                    '<a class= "page-link" href ="#">' + i + '</a>' +
                    '</li>';
            }
            paginationStr +=
                '<li class="page-item active paginationBtn" aria-current="page" data-page="' + pageNum + '">' +
                '<a class= "page-link" href ="#">' + pageNum + '</a>' +
                '</li>';
            for (let i = pageNum + 1; i <= total_pages; i++) {
                paginationStr +=
                    '<li class="page-item paginationBtn" data-page="' + i + '">' +
                    '<a class= "page-link" href ="#">' + i + '</a>' +
                    '</li>';
            }
        }
        paginationStr +=
            '<li class="page-item nextPaginationBtn">' +
            '<a class="page-link" href="#">Next</a>' +
            '</li>' +
            '</ul>' +
            '</nav>';
        $('#paginationNavigation').append(paginationStr);
        checkPageNum();
    }
}

function checkPageNum() {
    if (pageNum <= 1) {
        pageNum = 1;
        $('.prevPaginationBtn').addClass("page-item prevPaginationBtn disabled");
    }
    if (pageNum == total_pages)
        $('.nextPaginationBtn').addClass("page-item nextPaginationBtn disabled");
}

 // End of 'Functions'.
