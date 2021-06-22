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
    public class SeriesController : ApiController
    {

        /*
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        */

        // GET api/<controller>/5
        public HttpResponseMessage Get(int user_id)
        {
            try
            {
                Series series = new Series();
                List<Series> seriesList = series.Get(user_id);
                if (seriesList == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No series preferences exist for user id " + user_id);
                return Request.CreateResponse(HttpStatusCode.OK, seriesList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }
        

        // POST api/Series
        public HttpResponseMessage Post([FromBody] Series s)
        {
            try
            {
                if (s.Insert() == 0)
                    return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Cannot add the series to the database.");
                return Request.CreateResponse(HttpStatusCode.OK, "Series was succesfully added to the database.");
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

    } // End of class definition - SeriesController.
}