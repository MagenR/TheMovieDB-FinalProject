
window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

// ---------------------------------------- Constroller functions--------------------------

$(document).ready(function () {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var urlParam = 'users'; // Set Default param to users.
    urlParam= urlParams.get('category');
    renderText(urlParam);

});

// ---------------------------------------------- Getters ----------------------------------------------

// Get users list for admin use.
function getUsers() {
    let api = "../api/Users";

    ajaxCall("GET", api, "", getUsersSuccessCB, getErrorCB);
}

function getUsersSuccessCB(users) {
    renderUsers(users);
}

// Get series list for admin use.
function getSeries() {
    let api = "../api/Series/Admin";

    ajaxCall("GET", api, "", getSeriesSuccessCB, getErrorCB);
}

function getSeriesSuccessCB(series) {
    renderSeries(series);
}

// Get episodes list for admin use.
function getEpisodes() {
    let api = "../api/Episodes/Admin";

    ajaxCall("GET", api, "", getEpisodesSuccessCB, getErrorCB);
}

function getEpisodesSuccessCB(episodes) {
    renderEpisodes(episodes);
}

// Error function for getters, returns swal message.
function getErrorCB(err) {
    console.log(err.status + " " + err.responseJSON.Message);
    if (err.status == '404')
        swal("Error!", "404: " + err.responseJSON.Message, "error");
    else
        swal("Error!", err.responseJSON.Message, "error");
}

// ---------------------------------------------- List Renders ----------------------------------------------

function renderUsers(users) {

    $('#dataTableInsert').html(
        '<thead>' +
        '<tr>' +
        '<th>User Id</th>' +
        '<th>Email</th>' +
        '<th>First Name</th>' +
        '<th>Last Name</th>' +
        '<th>Password</th>' +
        '<th>Phone</th>' +
        '<th>Address</th>' +
        '<th>Fav Genre</th>' +
        '<th>Gender</th>' +
        '<th>Birthday</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '<tfoot>' +
        '<tr>' +
        '<th>User Id</th>' +
        '<th>Email</th>' +
        '<th>First Name</th>' +
        '<th>Last Name</th>' +
        '<th>Password</th>' +
        '<th>Phone</th>' +
        '<th>Address</th>' +
        '<th>Fav Genre</th>' +
        '<th>Gender</th>' +
        '<th>Birthday</th>' +
        '</tr>' +
        '</tfoot>'
    );

    try {
        tbl = $('#dataTableInsert').DataTable({
            data: users,
            pageLength: 10,
            columns: [
                { data: "User_id" },
                { data: "Email" },
                { data: "First_name" },
                { data: "Last_name" },
                { data: "Password" },
                { data: "Phone_num" },
                { data: "Address" },
                { data: "Fav_genre" },
                { data: "Gender" },
                {
                    data: "Birth_date",
                    render: function(data) {
                        return moment(data).format('DD/MM/YYYY');
                    }
                },
            ],
        });
    }
    catch (err) {
        alert(err);
    }
}

function renderSeries(series) {

    $('#dataTableInsert').html(
        '<thead>' +
        '<tr>' +
        '<th>Series Id</th>' +
        '<th>Name</th>' +
        '<th>Original Airing</th>' + 
        '<th>Origin</th>' +
        '<th>Language</th>' +
        '<th>Popularity</th>' +
        '<th># of Favourites</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '<tfoot>' +
        '<tr>' +
        '<th>Series Id</th>' +
        '<th>Name</th>' +
        '<th>Original Airing</th>' +
        '<th>Origin</th>' +
        '<th>Language</th>' +
        '<th>Popularity</th>' +
        '<th># of Favourites</th>' +
        '</tr>' +
        '</tfoot>'
    );

    try {
        tbl = $('#dataTableInsert').DataTable({
            data: series,
            pageLength: 10,
            columns: [
                { data: "Tv_id" },
                { data: "Name" },
                {
                    data: "First_air_date",
                    render: function(data) {
                        return moment(data).format('DD/MM/YYYY');
                    }
                },
                { data: "Origin_country" },
                { data: "Original_language" },
                { data: "Popularity" },
                { data: "FavCount" },
            ],
        });
    }
    catch (err) {
        alert(err);
    }
}

function renderEpisodes(episodes) {

    $('#dataTableInsert').html(
        '<thead>' +
        '<tr>' +
        '<th>Series Id</th>' +
        '<th>Series Name</th>' +
        '<th>Episode Name</th>' +
        '<th>Season Number</th>' +
        '<th>Episode Number</th>' +
        '<th>Original Airing</th>' +
        '<th># of Favourites</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '<tfoot>' +
        '<tr>' +
        '<th>Series Id</th>' +
        '<th>Series Name</th>' +
        '<th>Episode Name</th>' +
        '<th>Season Number</th>' +
        '<th>Episode Number</th>' +
        '<th>Original Airing</th>' +
        '<th># of Favourites</th>' +
        '</tr>' +
        '</tfoot>'
    );

    try {
        tbl = $('#dataTableInsert').DataTable({
            data: episodes,
            pageLength: 10,
            columns: [
                { data: "Tv_id" },
                { data: "Series_name" },
                { data: "Episode_name" },
                { data: "Season_number" },
                { data: "Episode_number" },
                {
                    data: "Air_date",
                    render: function (data) {
                        return moment(data).format('DD/MM/YYYY');
                    }
                },
                { data: "FavCount"}
            ],
        });
    }
    catch (err) {
        alert(err);
    }
}

// ---------------------------------------------- Dynamic text input ----------------------------------------------

function renderText(choice){

    var LoggedInName = logged_user.First_name + " " + logged_user.Last_name;
    var MainHeading;
    var MainText;
    var TableName;

    switch (choice) {
        case 'series':
            MainHeading = 'Series Data Base';
            MainText = 'All favourited series data and their count.';
            TableName = 'Series';
            getSeries();
            break;
        case 'episodes':
            MainHeading = 'Episodes Data Base';
            MainText = 'All favourited episodes by series data and their count.';
            TableName = 'Episodes';
            getEpisodes();
            break;
        case 'users':
        default:  
            MainHeading = 'Users Data Base';
            MainText = 'All registered user data.';
            TableName = 'Users';
            getUsers();
    }

    $('#MainHeading').html(MainHeading);
    $('#MainText').html(MainText);
    $('#TableName').html('<i class="fas fa-table me-1"></i>' + TableName);
    $('#LoggedInName').append(LoggedInName);
}
