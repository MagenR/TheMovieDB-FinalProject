using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TheMovieDB.Models.DAL;
using System.Globalization;

namespace TheMovieDB.Models
{
    public class User
    {

        // Fields ---------------------------------------------------------------------------------

        int user_id;
        string email, first_name, last_name, password, phone_num, address, fav_genre;
        char gender;
        DateTime birth_date;

        // Props ----------------------------------------------------------------------------------

        public int User_id { get => user_id; set => user_id = value; }
        public string Email { get => email; set => email = value; }
        public string First_name { get => first_name; set => first_name = value; }
        public string Last_name { get => last_name; set => last_name = value; }
        public string Password { get => password; set => password = value; }
        public string Phone_num { get => phone_num; set => phone_num = value; }
        public string Address { get => address; set => address = value; }
        public string Fav_genre { get => fav_genre; set => fav_genre = value; }
        public char Gender { get => gender; set => gender = value; }
        public DateTime Birth_date { get => birth_date; set => birth_date = value; }

        // Constructors ---------------------------------------------------------------------------

        public User() { }

        // Methods --------------------------------------------------------------------------------

        // Inserts itself to the database.
        public int Insert()
        {
            DataServices ds = new DataServices();
            if (ds.Insert(this) != 0)
                return 1; // Success adding.
            return 0; // Failure adding.
        }

        // Returns the user.
        public User Get(string email, string password)
        {
            DataServices ds = new DataServices();
            return ds.GetUser(email, password);
        }

        public User Get(int id)
        {
            DataServices ds = new DataServices();
            return ds.GetUser(id);
        }

        public List<User> GetUsersList()
        {
            DataServices ds = new DataServices();
            return ds.GetUserList();
        }

    } // End of class definition - User.

}