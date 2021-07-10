using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Text;
using Microsoft.Ajax.Utilities;

namespace TheMovieDB.Models.DAL
{
    public class DataServices
    {

        //--------------------------------------------------------------------------------------------------
        // Create a connection to the database according to the connectionString name in the web.config.
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(string conString)
        {
            // read the connection string from the configuration file
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        //--------------------------------------------------------------------------------------------------
        // Create the SqlCommand.
        //--------------------------------------------------------------------------------------------------
        private SqlCommand CreateCommand(SqlConnection con)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object
            cmd.Connection = con;              // assign the connection to the command object
            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds
            cmd.CommandType = CommandType.Text; // the type of the command, can also be stored procedure
            return cmd;
        }

        //--------------------------------------------------------------------------------------------------
        // append the Insert command text with values of given object to given command object.
        //--------------------------------------------------------------------------------------------------
        private void BuildInsertCommand(SqlCommand cmd, object o)
        {
            string commandText = "INSERT INTO ";

            if (o is Series)
            {
                Series s = (Series)o;
                commandText += "TheMovieDB_Series_2021 " +
                    "values(@tv_id, @first_air_date, @name, @origin_country, @original_language, @overview, @poster_path, @popularity) ";
                cmd.CommandText = commandText;

                cmd.Parameters.Add("@tv_id", SqlDbType.Int);
                cmd.Parameters["@tv_id"].Value = s.Tv_id;

                cmd.Parameters.Add("@first_air_date", SqlDbType.DateTime);
                cmd.Parameters["@first_air_date"].Value = (s.First_air_date).ToString("yyyy-MM-dd");

                cmd.Parameters.AddWithValue("@name", s.Name);
                cmd.Parameters.AddWithValue("@origin_country", s.Origin_country);
                cmd.Parameters.AddWithValue("@original_language", s.Original_language);
                cmd.Parameters.AddWithValue("@overview", s.Overview);
                cmd.Parameters.AddWithValue("@poster_path", s.Poster_path);

                cmd.Parameters.Add("@popularity", SqlDbType.Float);
                cmd.Parameters["@popularity"].Value = s.Popularity;
            }
            else if (o is Episode)
            {
                Episode e = (Episode)o;
                commandText += "TheMovieDB_Episodes_2021 " +
                    "values(@tv_id, @season_number, @episode_number, @name, @still_path, @overview, @air_date) ";
                cmd.CommandText = commandText;

                cmd.Parameters.Add("@tv_id", SqlDbType.Int);
                cmd.Parameters["@tv_id"].Value = e.Tv_id;

                cmd.Parameters.Add("@season_number", SqlDbType.Int);
                cmd.Parameters["@season_number"].Value = e.Season_number;

                cmd.Parameters.Add("@episode_number", SqlDbType.Int);
                cmd.Parameters["@episode_number"].Value = e.Episode_number;

                cmd.Parameters.AddWithValue("@name", e.Episode_name);
                cmd.Parameters.AddWithValue("@still_path", e.Still_path);
                cmd.Parameters.AddWithValue("@overview", e.Overview);

                cmd.Parameters.Add("@air_date", SqlDbType.DateTime);
                cmd.Parameters["@air_date"].Value = (e.Air_date).ToString("yyyy-MM-dd");
            }
            else if (o is User)
            {
                User u = (User)o;
                commandText += "TheMovieDB_Users_2021 ([email], [first_name], [last_name], [password], [phone_num], [address], [gender], [birth_date], [fav_genre]) " +
                    "values(@email, @first_name, @last_name, @password, @phone_num, @address, @gender, @birth_date, @fav_genre) ";
                cmd.CommandText = commandText;

                cmd.Parameters.AddWithValue("@email", u.Email);
                cmd.Parameters.AddWithValue("@first_name", u.First_name);
                cmd.Parameters.AddWithValue("@last_name", u.Last_name);
                cmd.Parameters.AddWithValue("@password", u.Password);
                cmd.Parameters.AddWithValue("@phone_num", u.Phone_num);
                cmd.Parameters.AddWithValue("@address", u.Address);

                cmd.Parameters.Add("@gender", SqlDbType.Char);
                cmd.Parameters["@gender"].Value = u.Gender;

                cmd.Parameters.Add("@birth_date", SqlDbType.DateTime);
                cmd.Parameters["@birth_date"].Value = (u.Birth_date).ToString("yyyy-MM-dd");

                cmd.Parameters.AddWithValue("@fav_genre", u.Fav_genre);
            }
            else if (o is Preference)
            {
                Preference p = (Preference)o;

                commandText += "TheMovieDB_Preferences_2021 " +
                    "values(@user_id, @tv_id, @season_number, @episode_number) ";
                cmd.CommandText = commandText;

                cmd.Parameters.Add("@user_id", SqlDbType.Int);
                cmd.Parameters["@user_id"].Value = p.UserPreference.User_id;

                cmd.Parameters.Add("@tv_id", SqlDbType.Int);
                cmd.Parameters["@tv_id"].Value = p.EpisodePreference.Tv_id;

                cmd.Parameters.Add("@season_number", SqlDbType.Int);
                cmd.Parameters["@season_number"].Value = p.EpisodePreference.Season_number;

                cmd.Parameters.Add("@episode_number", SqlDbType.Int);
                cmd.Parameters["@episode_number"].Value = p.EpisodePreference.Episode_number;
            }

        }

        //--------------------------------------------------------------------------------------------------
        // Insert an object to the database.
        //--------------------------------------------------------------------------------------------------
        public int Insert(object o)
        {

            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                throw (ex);// write to log
            }

            cmd = CreateCommand(con); // create the command
            BuildInsertCommand(cmd, o); // Append fields to insert command.

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (SqlException sx)
            {
                switch (sx.Number)
                {
                    case 2627: // Ignore dupe / unique key errors.
                    case 2601:
                        return 0; // Cannot add the series.
                    default:
                        throw (sx);
                }
            }
            catch (Exception ex)
            {
                throw (ex); // write to log
            }

            finally
            {
                if (con != null)
                    con.Close();// close the db connection
            }

        }

        //--------------------------------------------------------------------------------------------------
        // Get user credentials.
        //--------------------------------------------------------------------------------------------------
        public User GetUser(string email, string password)
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                string selectSTR = "SELECT * FROM TheMovieDB_Users_2021 as u WHERE u.email = '" + email + "' and u.password = '" + password + "'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr.HasRows == false) // no record returned.
                    return null; // if no user found.

                User u = new User();
                dr.Read();
                u.User_id = (int)dr["user_id"];
                u.First_name = (string)dr["first_name"];
                u.Last_name = (string)dr["last_name"];
                u.Email = (string)dr["email"];
                u.Address = (string)dr["address"];
                u.Phone_num = (string)dr["phone_num"];
                u.Birth_date = (DateTime)dr["birth_date"];
                u.Gender = ((string)dr["gender"])[0];
                u.Password = (string)dr["password"];
                u.Fav_genre = (string)dr["fav_genre"];
                return u;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        //--------------------------------------------------------------------------------------------------
        // Get list of all users in db.
        //--------------------------------------------------------------------------------------------------
        public List<User> GetUserList()
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                string selectSTR = "SELECT * FROM TheMovieDB_Users_2021 ";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr.HasRows == false) // no record returned.
                    return null; // if no user found.

                List<User> users = new List<User>();
                while (dr.Read())
                {
                    User u = new User();
                    u.User_id = (int)dr["user_id"];
                    u.First_name = (string)dr["first_name"];
                    u.Last_name = (string)dr["last_name"];
                    u.Email = (string)dr["email"];
                    u.Address = (string)dr["address"];
                    u.Phone_num = (string)dr["phone_num"];
                    u.Birth_date = (DateTime)dr["birth_date"];
                    u.Gender = ((string)dr["gender"])[0];
                    u.Password = (string)dr["password"];
                    u.Fav_genre = (string)dr["fav_genre"];

                    users.Add(u);
                }
                return users;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        //--------------------------------------------------------------------------------------------------
        // Get list of all series in db.
        //--------------------------------------------------------------------------------------------------
        public List<Series> GetSeriesList()
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                string selectSTR = "SELECT DISTINCT * FROM TheMovieDB_Series_2021 ";

                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr.HasRows == false) // no record returned.
                    return null; // if no series found.

                List<Series> series = new List<Series>();

                while (dr.Read())
                {
                    Series s = new Series();

                    s.Tv_id = (int)dr["tv_id"];
                    s.First_air_date = (DateTime)dr["first_air_date"];
                    s.Name = (string)dr["name"];
                    s.Origin_country = (string)dr["origin_country"];
                    s.Original_language = (string)dr["original_language"];
                    s.Overview = (string)dr["overview"];
                    s.Poster_path = (string)dr["poster_path"];
                    s.Popularity = (float)(double)dr["popularity"];

                    series.Add(s);
                }

                return series;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        //--------------------------------------------------------------------------------------------------
        // Get list of series a single user liked.
        //--------------------------------------------------------------------------------------------------
        public List<Series> GetSeriesList(int user_id)
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                string selectSTR = "SELECT DISTINCT s.* FROM TheMovieDB_Preferences_2021 as p INNER JOIN TheMovieDB_Series_2021 as s on p.tv_id = s.tv_id " +
                    "WHERE p.user_id = " + user_id +
                    " ORDER BY s.name";

                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr.HasRows == false) // no record returned.
                    return null; // if no series found.

                List<Series> user_series = new List<Series>();

                while (dr.Read())
                {
                    Series s = new Series();

                    s.Tv_id = (int)dr["tv_id"];
                    s.First_air_date = (DateTime)dr["first_air_date"];
                    s.Name = (string)dr["name"];
                    s.Origin_country = (string)dr["origin_country"];
                    s.Original_language = (string)dr["original_language"];
                    s.Overview = (string)dr["overview"];
                    s.Poster_path = (string)dr["poster_path"];
                    s.Popularity = (float)(double)dr["popularity"];

                    user_series.Add(s);
                }

                return user_series;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        //--------------------------------------------------------------------------------------------------
        // Get list of all series in db with favourite count. Admin version.
        //--------------------------------------------------------------------------------------------------
        public List<Series> GetSeriesListCountFavs()
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString");
                string selectSTR = "SELECT s.tv_id, s.name, s.first_air_date, s.origin_country, s.original_language, s.popularity, COUNT(distinct User_id) as '#_of_favs' FROM TheMovieDB_Preferences_2021 as p inner join TheMovieDB_Series_2021 as s on p.tv_id = s.tv_id GROUP BY s.tv_id, s.name, s.first_air_date, s.origin_country, s.original_language, s.popularity";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                if (dr.HasRows == false)
                    return null;
                List<Series> series = new List<Series>();
                
                while (dr.Read())
                {
                    Series s = new Series();

                    s.Tv_id = (int)dr["tv_id"];
                    s.Name = (string)dr["name"];
                    s.First_air_date = (DateTime)dr["first_air_date"];
                    s.Origin_country = (string)dr["origin_country"];
                    s.Original_language = (string)dr["original_language"];
                    s.Popularity = (float)(double)dr["popularity"];
                    s.FavCount = (int)dr["#_of_favs"];

                    series.Add(s);
                }

                return series;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        //--------------------------------------------------------------------------------------------------
        // Get list of episodes.
        //--------------------------------------------------------------------------------------------------
        public List<Episode> GetEpisodeList()
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                string selectSTR = "SELECT * FROM TheMovieDB_Episodes_2021 ";

                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr.HasRows == false) // no record returned.
                    return null; // if no series found.

                List<Episode> episodes = new List<Episode>();

                while (dr.Read())
                {
                    Episode e = new Episode();

                    e.Tv_id = (int)dr["tv_id"];
                    e.Season_number = (int)dr["season_number"];
                    e.Episode_number = (int)dr["episode_number"];
                    e.Episode_name = (string)dr["name"];
                    e.Still_path = (string)dr["still_path"];
                    e.Overview = (string)dr["overview"];
                    e.Air_date = (DateTime)dr["air_date"];

                    episodes.Add(e);
                }

                return episodes;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        //--------------------------------------------------------------------------------------------------
        // Get list of episodes the user liked according to series.
        //--------------------------------------------------------------------------------------------------
        public List<Episode> GetEpisodeList(int user_id, int tv_id)
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                string selectSTR = "SELECT e.* FROM TheMovieDB_Preferences_2021 as p INNER JOIN TheMovieDB_Episodes_2021 as e on p.tv_id = e.tv_id " +
                    "and p.season_number = e.season_number and p.episode_number = e.episode_number " +
                    "WHERE p.user_id = " + user_id + " and " + "p.tv_id = " + tv_id +
                    " ORDER BY e.season_number, e.episode_number";

                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr.HasRows == false) // no record returned.
                    return null; // if no series found.

                List<Episode> user_series_episodes = new List<Episode>();

                while (dr.Read())
                {
                    Episode e = new Episode();

                    e.Tv_id = (int)dr["tv_id"];
                    e.Season_number = (int)dr["season_number"];
                    e.Episode_number = (int)dr["episode_number"];
                    e.Episode_name = (string)dr["name"];
                    e.Still_path = (string)dr["still_path"];
                    e.Overview = (string)dr["overview"];
                    e.Air_date = (DateTime)dr["air_date"];

                    user_series_episodes.Add(e);
                }

                return user_series_episodes;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        //--------------------------------------------------------------------------------------------------
        // Get list of all episodes in db with favourite count. Admin version.
        //--------------------------------------------------------------------------------------------------
        public List<Episode> GetEpisodeListCountFavs()
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                string selectSTR = "SELECT s.tv_id, s.name as 'series name', e.name as 'episode name', e.season_number, e.episode_number, e.air_date, COUNT(User_id) as '# of favourites' FROM TheMovieDB_Preferences_2021 as p inner join TheMovieDB_Episodes_2021 as e on p.tv_id = e.tv_id and p.season_number = e.season_number and p.episode_number = e.episode_number inner join TheMovieDB_Series_2021 as s on p.tv_id = s.tv_id GROUP BY s.tv_id, s.name, e.name, e.season_number, e.episode_number, e.air_date";

                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                if (dr.HasRows == false) // no record returned.
                    return null; // if no series found.

                List<Episode> episodes = new List<Episode>();

                while (dr.Read())
                {
                    Episode e = new Episode();

                    e.Tv_id = (int)dr["tv_id"];
                    e.Series_name = (string)dr["series name"];
                    e.Episode_name = (string)dr["episode name"];
                    e.Season_number = (int)dr["season_number"];
                    e.Episode_number = (int)dr["episode_number"];
                    e.Air_date = (DateTime)dr["air_date"];
                    e.FavCount = (int)dr["# of favourites"];

                    episodes.Add(e);
                }

                return episodes;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

    } // End of class definition - DataServices.

}