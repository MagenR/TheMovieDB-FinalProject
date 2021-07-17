
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

        // Read comments from the DB.
        getComments: function (success, error) {
            $.ajax({
                type: 'get',
                url: '../api/Comments',
                success: function (commentsArray) {
                    success(commentsArray)
                },
                error: getErrorCB
            });
        },

        // Post a comment to the db.
        postComment: function (commentJSON, success, error) {
            $.ajax({
                type: 'post',
                url: '/api/comments/',
                data: commentJSON,
                success: function (comment) {
                    success(comment)
                },
                error: getErrorCB
            });
        },

        // Upvote comment, save to the db.
        upvoteComment: function (commentJSON, success, error) {
            var commentURL = '/api/comments/' + commentJSON.id;
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

    }); 
} // End of "initComments".

function getErrorCB(err) {
    console.log("Error Status: " + err.status + " Message: " + err.responseJSON.Message);
}