using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TheMovieDB.Models;
using TheMovieDB.Models.DAL;

namespace TheMovieDB_FinalProject.Controllers
{
    public class UpvotesController : ApiController
    {
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

        // POST api/<controller>


        // PUT api/<controller>/5
        public HttpResponseMessage Post([FromBody] Upvote u)
        {
            try
            {
                if (u.Insert() == 0)
                    return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Cannot add upvote to this comment.");
                return Request.CreateResponse(HttpStatusCode.OK, u);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }
        public void DeleteUpvote(int user_id, int comment_id)
        {

        }
        // DELETE api/<controller>/5
        public HttpResponseMessage Delete([FromBody] Upvote u)
        {
            try
            {
                if (u.Delete() == 0)
                    return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Cannot add upvote to this comment.");
                return Request.CreateResponse(HttpStatusCode.OK, u);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }
    }
}