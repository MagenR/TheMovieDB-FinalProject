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

        // Get a specific preference, if exists.
        public bool GetCheckPreference(int user_id, int series_id, int season_id, int episode_id)
        {
            DataServices ds = new DataServices();
            return ds.GetCheckPreference(user_id, series_id, season_id, episode_id);
        }

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