﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
using API.Models;
namespace API.Controllers.Users.UserAccess
{
    public class DeleteUserAccessController : ApiController
    {
        StoreEntities db = new StoreEntities();

        [HttpGet]
        public string Get(string UserName, int ID)
        {
            try
            {
                var gg = db.UserAccesses.Where(a => a.ID== ID).FirstOrDefault();
                db.UserAccesses.Remove(gg);
                var dd = db.SaveChanges();
                return "0";

            }
            catch (Exception ex)
            {
                return ex.Message;
            }


        }
    }
}
