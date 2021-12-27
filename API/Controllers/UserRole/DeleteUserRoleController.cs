using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
namespace API.Controllers.UserRole
{
    public class DeleteUserRoleController : ApiController
    {
        StoreEntities db = new StoreEntities();
        [HttpGet]

        public string Get(string UserName, int ID)
        {
            try
            {
                var gg = db.UserRoles.Where(a => a.ID== ID).FirstOrDefault();
                db.UserRoles.Remove(gg);
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
