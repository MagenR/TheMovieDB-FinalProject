﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TheMovieDB.Models.DAL;

namespace TheMovieDB.Models
{
    public class Series
    {

        // Fields ---------------------------------------------------------------------------------

        int tv_id, favCount;
        DateTime first_air_date;
        string name, origin_country, original_language, overview, poster_path;
        float popularity;

        // Props ----------------------------------------------------------------------------------

        public int Tv_id { get => tv_id; set => tv_id = value; }
        public int FavCount { get => favCount; set => favCount = value; }
        public DateTime First_air_date { get => first_air_date; set => first_air_date = value; }
        public string Name { get => name; set => name = value; }
        public string Origin_country { get => origin_country; set => origin_country = value; }
        public string Original_language { get => original_language; set => original_language = value; }
        public string Overview { get => overview; set => overview = value; }
        public string Poster_path { get => poster_path; set => poster_path = value; }
        public float Popularity { get => popularity; set => popularity = value; }

        // Constructors ---------------------------------------------------------------------------

        public Series() { }

        //Methods ---------------------------------------------------------------------------------

        // Inserts itself to the database.
        public int Insert()
        {
            DataServices ds = new DataServices();
            if (ds.Insert(this) != 0)
                return 1; // Success adding.
            return 0; // Failure adding.
        }

        // Returns list of all series in the DB.
        public List<Series> GetSeriesList()
        {
            DataServices ds = new DataServices();
            return ds.GetSeriesList();
        }

        // Returns list of series a certain user liked.
        public List<Series> GetSeriesList(int user_id)
        {
            DataServices ds = new DataServices();
            return ds.GetSeriesList(user_id);
        }

        // Returns list of series for admin use, with favourites count.
        public List<Series> GetSeriesListCountFavs()
        {
            DataServices ds = new DataServices();
            return ds.GetSeriesListCountFavs();
        }

    } // End of class definition - Series.

}