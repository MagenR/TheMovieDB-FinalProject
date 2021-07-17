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
    public class CommentsController : ApiController
    {
        // GET api/<controller>
        public HttpResponseMessage Get(int tvid, int season_number, int episode_number)
        {
            try
            {
                Comment c = new Comment();
                List<Comment> cl = c.GetCommentsList(tvid, season_number, episode_number);
                if (cl == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Comments.");
                return Request.CreateResponse(HttpStatusCode.OK, cl);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public HttpResponseMessage Post([FromBody] Comment c)
        {
            try
            {
                if (c.Insert() == 0)
                    return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Cannot add the comment to the database.");
                return Request.CreateResponse(HttpStatusCode.OK, "Comment was succesfully posted.");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}