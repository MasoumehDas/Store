using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using DataAccess;
namespace API.Controllers
{
    
    public class LoginController : ApiController
    {
        
        StoreEntities db = new StoreEntities();
        [HttpGet]
        public List<sp_UserProfile_Login_Result> Get(string Lang, string UserName, string Password)
        {
            var list = db.sp_UserProfile_Login(Lang, UserName, Password).ToList();
            return list;
        }
        
    }
    
}
