using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
namespace API.Controllers
{
    public class BasicDataController : ApiController
    {
        DataAccess.StoreEntities db = new StoreEntities();
    //    public List<DataAccess.sp_BasicDate_Select_Result> Get(string Lang, string UserName, string IP, string GroupType,bool IsShowSearch)
    //    {
    //        return db.sp_BasicDate_Select(Lang, UserName, IP, GroupType).ToList();
    //    }
    //    public List<DataAccess.sp_BasicDate_Select_Result> Get(string Lang, string GroupType)
    //    {
    //        return db.sp_BasicDate_Select(Lang, "", "", GroupType).ToList();
    //    }
    }
}
