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
        /*
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }
        */

        // POST api/Preferences
        public HttpResponseMessage Post([FromBody] Preference p)
        {
            if (p.Insert() == 0)
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Cannot add the episode to the current usere's preferences.");
            return Request.CreateResponse(HttpStatusCode.OK, "Episode was succesfully added to the user's preferences.");
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