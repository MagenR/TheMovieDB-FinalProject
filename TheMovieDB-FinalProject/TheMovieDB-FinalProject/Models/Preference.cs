using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TheMovieDB.Models.DAL;

namespace TheMovieDB.Models
{
    public class Preference
    {
        // Fields ---------------------------------------------------------------------------------

        User user;
        Episode episode;

        // Props
        public User UserPreference { get => user; set => user = value; }
        public Episode EpisodePreference { get => episode; set => episode = value; }

        // Constructors ---------------------------------------------------------------------------

        public Preference() { }

        // Methods --------------------------------------------------------------------------------

        // Inserts itself to the database.
        public int Insert()
        {
            DataServices ds = new DataServices();
            if (ds.Insert(this) != 0)
                return 1; // Success adding.
            return 0; // Failure adding.
        }

    } // End of class definition - Preference.

}