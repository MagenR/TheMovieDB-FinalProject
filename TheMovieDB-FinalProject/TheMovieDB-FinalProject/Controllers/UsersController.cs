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
    public class UsersController : ApiController
    {
        // GET api/<controller>
        public HttpResponseMessage Get()
        {
            try
            {
                User u = new User();
                List<User> users = u.GetUsersList();
                if (users == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Users.");
                return Request.CreateResponse(HttpStatusCode.OK, users);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }

        public HttpResponseMessage Get(int id)
        {
            try
            {
                User u = new User();
                u = u.Get(id);
                if (u == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No User with such id.");
                return Request.CreateResponse(HttpStatusCode.OK, u);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }


        // GET api/<controller>/5
        public HttpResponseMessage Get(string email, string password)
        {
            try
            {
                User user = new User();
                user = user.Get(email, password);
                if (user == null)
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Cannot log in. Incorrect password or email.");
                return Request.CreateResponse(HttpStatusCode.OK, user);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, ex.Message);
            }
        }

        // POST api/Users
        public HttpResponseMessage Post([FromBody] User user)
        {
            try
            {
                if (user.Insert() == 0)
                    return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Cannot create new account. Email already registered.");
                return Request.CreateResponse(HttpStatusCode.OK, "Registered succesfully.");
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
    } // End of class definition - UsersController.

}