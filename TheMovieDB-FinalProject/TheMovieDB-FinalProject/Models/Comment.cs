using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TheMovieDB.Models.DAL;

namespace TheMovieDB.Models
{
    public class Comment
    {

        // Fields ---------------------------------------------------------------------------------

        int comment_id, user_id, tv_id, season_number, episode_number, upvote_count;
        int? parent_comment_id;
        string content, user_name;
        DateTime date_created;
        string profilePictureURL;

        // Props ----------------------------------------------------------------------------------

        public int Comment_id { get => comment_id; set => comment_id = value; }
        public int User_id { get => user_id; set => user_id = value; }
        public int Tv_id { get => tv_id; set => tv_id = value; }
        public int Season_number { get => season_number; set => season_number = value; }
        public int Episode_number { get => episode_number; set => episode_number = value; }
        public int? Parent_comment_id { get => parent_comment_id; set => parent_comment_id = value; }
        public int Upvote_count { get => upvote_count; set => upvote_count = value; }
        public string Content { get => content; set => content = value; }
        public string User_name { get => user_name; set => user_name = value; }
        public DateTime Date_created { get => date_created; set => date_created = value; }
        public string ProfilePictureURL { get => "../uploadedFiles/" + User_id + ".png"; }

        //Constructors ----------------------------------------------------------------------------

        public Comment() { }

        //Methods ---------------------------------------------------------------------------------

        // Inserts this comment to the database.
        public int Insert()
        {
            DataServices ds = new DataServices();
            if (ds.Insert(this) != 0)
                return 1; // Success adding.
            return 0; // Failure adding.
        }

        public int InsertUpvote(Comment c, int upvoter_id)
        {
            DataServices ds = new DataServices();
            return InsertUpvote(c, upvoter_id);
        }

        // Gets comment list for given episode.
        public List<Comment> GetCommentsList(int tv_id, int season_number, int episode_number)
        {
            DataServices ds = new DataServices();
            List<Comment> cList = ds.GetCommentsList(tv_id, season_number, episode_number);
            return cList;
        }
    }



}