using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using DataAccess;
using API.Models;
using System.Web;

namespace API.Controllers.Companies
{
    public class SelectCompanyController : ApiController
    {
        StoreEntities db = new StoreEntities();
        [HttpGet]
        
        public List<sp_Company_Select_Result> Get(string Lang, string CompanyName, string UserName, int? CountryID_BasicData, int? CityID_BasicData, int? CompanyGroupID_ProductSpecification)
        {
            int? ID = null;
            var list = db.sp_Company_Select(Lang, Settings.SetNull(UserName), Settings.GetIP(), ID, CountryID_BasicData, CityID_BasicData, Settings.SetNull(CompanyName),null, CompanyGroupID_ProductSpecification,null).ToList();
            return list;
        }
        [HttpGet]
        public List<sp_Company_Select_Result> Get(string Lang, string UserName, int? ID)
        {
            var list = db.sp_Company_Select(Lang, Settings.SetNull(UserName), Settings.GetIP(), ID, null, null, null, null, null, null).ToList();
            return list;
        }
        [HttpGet]
        public List<sp_Company_Select_Result> Get(string Lang, string UserName)
        {
            var list = db.sp_Company_Select(Lang, Settings.SetNull(UserName), Settings.GetIP(), null, null, null, null, null, null, null).ToList();
            return list;
        }



    }
}
