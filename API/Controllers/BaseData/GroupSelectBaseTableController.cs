using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
namespace API.Controllers.ProductSpecification
{
    public class GroupSelectBaseTableController : ApiController
    {
        StoreEntities db = new StoreEntities();
        [HttpGet]
        public List<sp_BaseData_GroupSelect_Result> Get(string CodeChar,string Lang = null, string UserName = null)
        {
            var list= db.sp_BaseData_GroupSelect(Lang, CodeChar).ToList();
            return list;
        }
    }
}
