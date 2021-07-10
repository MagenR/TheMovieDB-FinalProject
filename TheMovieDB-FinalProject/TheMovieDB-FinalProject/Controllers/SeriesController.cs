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

        // GET api/<controller>
        public HttpResponseMessage Get()
        {
            try
            {
                Series s = new Series();
                List<Series> series = s.GetSeriesList();
                if (series == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Users.");
                return Request.CreateResponse(HttpStatusCode.OK, series);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }


        // GET api/<controller>/5
        public HttpResponseMessage Get(int user_id)
        {
            try
            {
                Series series = new Series();
                List<Series> seriesList = series.GetSeriesList(user_id);
                if (seriesList == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No series preferences exist for user id " + user_id);
                return Request.CreateResponse(HttpStatusCode.OK, seriesList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }

        // Admin version for get.
        [HttpGet]
        [Route("api/Series/Admin")]
        public HttpResponseMessage GetCountFavs()
        {
            try
            {
                Series series = new Series();
                List<Series> seriesList = series.GetSeriesListCountFavs();
                if (seriesList == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No saved episodes exist ");
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