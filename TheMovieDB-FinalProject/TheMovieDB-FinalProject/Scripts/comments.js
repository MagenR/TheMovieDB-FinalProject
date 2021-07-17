
commentsArray = [{
    id: 1,
    profile_picture_url: profilePicPath,
    created: '2015-10-01',
    content: 'Lorem ipsum dolort sit amet',
    fullname: 'Simon Powell',
    upvote_count: 2,
    user_has_upvoted: false
}];

function initComments() {
    var profilePicPath = '../uploadedFiles/' + logged_user.User_id + '.png';

    $('#comments-container').comments({
        profilePictureURL: profilePicPath,
        currentUserId: logged_user.User_id,
        roundProfilePictures: true,
        fieldMappings: {
            id: 'Comment_id',
            parent: 'Parent_comment_id',
            content: 'Content',
            fullname: 'User_name',
            profilePictureURL: 'ProfilePictureURL',
            created: 'Date_created'
        },
        refresh: function () {
            $('#comments-container').addClass('rendered');
        },
        // Read comments from the DB.
        getComments: function (success, error) {
            $.ajax({
                type: 'get',
                url: '../api/Comments?tvid=' + tv_id + '&season_number=' + season_num + '&episode_number=' + episode_num,
                //contentType: 'application/json; charset=utf-8',
                //data: JSON.stringify({ tvid: tv_id, season_number: season_num, episode_number: episode_num }),
                //dataType: 'json',
                success: function (commentsArray) {
                    success(commentsArray)
                },
                error: getErrorCB
            });
        },

        // Post a comment to the db.
        postComment: function (commentJSON, success, error) {
            
            var commentToAdd = {
                User_id: logged_user.User_id,
                Tv_id: tv_id,
                Season_number: season_num,
                Episode_number: episode_num,
                Parent_comment_id: commentJSON.Parent_comment_id,
                Content: commentJSON.Content,
                Date_created: commentJSON.Date_created
            }
            
            $.ajax({
                type: 'post',
                url: '../api/Comments/',
                data: commentToAdd,
                success: function (comment) {
                    success(comment)
                },
                error: getErrorCB
            });
        },

        // Upvote comment, save to the db.
        /*
        upvoteComment: function (commentJSON, success, error) {
            var commentURL = '../api/Comments/' + commentJSON.id;
            var upvotesURL = commentURL + '/upvotes/';

            if (commentJSON.userHasUpvoted) {
                $.ajax({
                    type: 'post',
                    url: upvotesURL,
                    data: {
                        comment: commentJSON.id
                    },
                    success: function () {
                        success(commentJSON)
                    },
                    error: error
                });
            } else {
                $.ajax({
                    type: 'delete',
                    url: upvotesURL + upvoteId,
                    success: function () {
                        success(commentJSON)
                    },
                    error: error
                });
            }
        }
        */

    }); 
} // End of "initComments".

function getErrorCB(err) {
    console.log("Error Status: " + err.status + " Message: " + err.responseJSON.Message);
}