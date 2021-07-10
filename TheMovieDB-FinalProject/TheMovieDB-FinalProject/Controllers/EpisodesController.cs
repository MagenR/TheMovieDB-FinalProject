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
    public class EpisodesController : ApiController
    {
        // GET api/<controller>
        public HttpResponseMessage Get()
        {
            try
            {
                Episode e = new Episode();
                List<Episode> episodes = e.GetEpisodeList();
                if (episodes == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Users.");
                return Request.CreateResponse(HttpStatusCode.OK, episodes);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }

        // GET api/<controller>/5
        public HttpResponseMessage Get(int user_id, int tv_id)
        {
            try
            {
                Episode ep = new Episode();
                List<Episode> epList = ep.GetEpisodeList(user_id, tv_id);
                if (epList == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No saved episodes exist for user id " + user_id);
                return Request.CreateResponse(HttpStatusCode.OK, epList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }
        
        [HttpGet]
        [Route("api/Episodes/Admin")]
        public HttpResponseMessage GetFavEpsByUsers()
        {
            try
            {
                Episode ep = new Episode();
                List<Episode> epList = ep.GetEpisodeListCountFavs();
                if (epList == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No saved episodes exist ");
                return Request.CreateResponse(HttpStatusCode.OK, epList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }
        
        // POST api/Episodes
        public HttpResponseMessage Post([FromBody] Episode ep)
        {
            try
            {
                if (ep.Insert() == 0)
                    return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Cannot add the episode to the database.");
                return Request.CreateResponse(HttpStatusCode.OK, "Episode was succesfully added to the database.");
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
    } // End of class definition - EpisodesController.

}