using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
namespace API.Controllers
{
    public class BaseDataController : ApiController
    {
        StoreEntities db = new StoreEntities();
       
        [HttpGet]

        public List<sp_BaseData_Select_Result> Get(string Lang, string UserName, string GroupType,string CodeChar)
        {
            int? ID = null;
            var list = db.sp_BaseData_Select(Lang, UserName, ID, GroupType, null, CodeChar, null).ToList();
            return list;
        }
        [HttpGet]
        public List<sp_BaseData_Select_Result> Get(string Lang, string UserName, int ID)
        {
            var list = db.sp_BaseData_Select(Lang, UserName, ID, null,null,null,null).ToList();
            return list;
        }
        [HttpGet]
        public List<sp_BaseData_Select_Result> Get(string Lang, string UserName)
        {
            var list = db.sp_BaseData_Select(Lang, UserName, null, null, null, null, null).ToList();
            return list;
        }
    }
}
