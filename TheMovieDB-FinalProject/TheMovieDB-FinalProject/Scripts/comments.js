
// global vars ------------------------------------------------------------------------------------

userId = 0;
profilePicPath = '../Images/profile - placeholder.jpg';

function initComments() {
    if (logged_user != null) {
        var profilePicPath = '../uploadedFiles/' + logged_user.User_id + '.png';
        userId = logged_user.User_id;
    }
    
    $('#comments-container').comments({
        profilePictureURL: profilePicPath,
        currentUserId: userId,
        roundProfilePictures: true,
        enablePinging: false,
        readOnly: (logged_user == null),
        fieldMappings: {
            id: 'Comment_id',
            parent: 'Parent_comment_id',
            content: 'Content',
            fullname: 'User_name',
            profilePictureURL: 'ProfilePictureURL',
            created: 'Date_created',
            upvoteCount: 'Upvote_count',
            userHasUpvoted : 'UserUpvoted'
        },
        refresh: function () {
            $('#comments-container').addClass('rendered');
        },
        // Read comments from the DB.
        getComments: function (success, error) {
            if (userId == 0)
            $.ajax({
                type: 'get',
                url: '../api/Comments?tvid=' + tv_id + '&season_number=' + season_num + '&episode_number=' + episode_num,
                success: function (commentsArray) {
                    success(commentsArray)
                    console.log("Comments got");
                },
                error: function (err) {
                    getErrorCB(err)
                }
            });
            else
                $.ajax({
                    type: 'get',
                    url: '../api/Comments/Upvoted?tvid=' + tv_id + '&season_number=' + season_num + '&episode_number=' + episode_num + '&user_id=' + userId,
                    success: function (commentsArray) {
                        success(commentsArray)
                        console.log("Comments got");
                    },
                    error: function (err) {
                        getErrorCB(err)
                    }
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
                success: function (data) {
                    //success(location.reload())
                    data.User_name = logged_user.First_name + ' ' + logged_user.Last_name
                    success(data)

                },
                error: function (err) {
                    getErrorCB(err)
                }
            });
        },

        // Upvote comment, save to the db.
        
        upvoteComment: function (commentJSON, success, error) {
            var commentURL = '../api/Comments/' + commentJSON.id;
            var upvotesURL = commentURL + '/upvotes/';

            var upvote = {
                Comment_id: commentJSON.Comment_id,
                Upvoter_id: logged_user.User_id
            }
            if (commentJSON.UserUpvoted) {
                $.ajax({
                    type: 'post',
                    url: '../api/Upvotes',
                    data: upvote,
                    success: function () {
                        success(commentJSON)
                    },
                    error: function (err) {
                        getErrorCB(err)
                    }
                });
            } else {
                $.ajax({
                    type: 'delete',
                    url: '../api/Upvotes',
                    data: upvote,
                    success: function () {
                        success(commentJSON)
                    },
                    error: function (err) {
                        getErrorCB(err)
                    }
                });
            }
        }
        
    });
    
} // End of "initComments".

function getErrorCB(err) {
    console.log("Error Status: " + err.status + " Message: " + err.responseJSON.Message);
}