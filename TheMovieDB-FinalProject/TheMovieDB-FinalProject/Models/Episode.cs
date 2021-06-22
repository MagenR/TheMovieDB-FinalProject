using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TheMovieDB.Models.DAL;

namespace TheMovieDB.Models
{
    public class Episode
    {

        // Fields ---------------------------------------------------------------------------------

        string name, still_path, overview;
        int tv_id, season_number, episode_number;
        DateTime air_date;

        // Props ----------------------------------------------------------------------------------

        public string Name { get => name; set => name = value; }
        public string Still_path { get => still_path; set => still_path = value; }
        public string Overview { get => overview; set => overview = value; }
        public int Tv_id { get => tv_id; set => tv_id = value; }
        public int Season_number { get => season_number; set => season_number = value; }
        public int Episode_number { get => episode_number; set => episode_number = value; }
        public DateTime Air_date { get => air_date; set => air_date = value; }

        //Constructors ----------------------------------------------------------------------------

        public Episode() { }
        public Episode(string name, string still_path, string overview,
            int tv_id, int season_number, int episode_number,
            string air_date)
        {
            Tv_id = tv_id;
            Season_number = season_number;
            Episode_number = episode_number;
            Name = name;
            Still_path = still_path;
            Overview = overview;
            Air_date = Convert.ToDateTime(air_date);
        }

        //Methods ---------------------------------------------------------------------------------

        // Inserts itself to the database.
        public int Insert()
        {
            DataServices ds = new DataServices();
            if (ds.Insert(this) != 0)
                return 1; // Success adding.
            return 0; // Failure adding.
        }

        // Returns list of episodes.
        public List<Episode> Get(int user_id, int tv_id)
        {
            DataServices ds = new DataServices();
            List<Episode> epList = ds.GetSeriesEpisodeList(user_id, tv_id);
            return epList;
        }

    } // End of class definition - Episode.

}