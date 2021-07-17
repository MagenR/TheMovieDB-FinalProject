using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TheMovieDB.Models;
using TheMovieDB.Models.DAL;

namespace TheMovieDB.Controllers
{
    public class PreferencesController : ApiController
    {
        // GET api/<controller>
        public HttpResponseMessage Get(int user_id, int series_id, int season_id, int episode_id)
        {
            try
            {
                Preference p = new Preference();
                bool exist = p.GetCheckPreference(user_id, series_id, season_id, episode_id);
                if (exist == false)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "User has no pereference for this episode.");
                return Request.CreateResponse(HttpStatusCode.OK, "User has this episode as favourite");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }

        // POST api/Preferences
        public HttpResponseMessage Post([FromBody] Preference p)
        {
            try
            {
                if (p.Insert() == 0)
                    return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Cannot add the episode to the current user's preferences.");
                return Request.CreateResponse(HttpStatusCode.OK, "Episode was succesfully added to the user's preferences.");
            }      
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }
        /*
        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
        */
    } // End of class definition - PreferencesController.

}