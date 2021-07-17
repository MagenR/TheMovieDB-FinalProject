using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TheMovieDB.Models.DAL;

namespace TheMovieDB.Models
{
    public class Upvote
    {
        // Fields ---------------------------------------------------------------------------------
        int upvoter_id, comment_id;

        // Props ----------------------------------------------------------------------------------
        public int Upvoter_id { get => upvoter_id; set => upvoter_id = value; }
        public int Comment_id { get => comment_id; set => comment_id = value; }

        //Constructors ----------------------------------------------------------------------------
        public Upvote(){}

        //Methods ---------------------------------------------------------------------------------

        // Inserts this upvote to the database.
        public int Insert()
        {
            DataServices ds = new DataServices();
            if (ds.Insert(this) != 0)
                return 1; // Success adding.
            return 0; // Failure adding.
        }
        
        // Deletes this upvote to the database.
        public int Delete()
        {
            DataServices ds = new DataServices();
            if (ds.Delete(this) != 0)
                return 1; // Success deleting.
            return 0; // Failure deleting
        }
    }
}