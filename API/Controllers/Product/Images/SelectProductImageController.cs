using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
using API.Models;

namespace API.Controllers
{
    public class SelectProductImageController : ApiController
    {
        StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        [HttpGet]
        public List<sp_ProductImage_Select_Result> Get(string Lang,string UserName, int? ProductID, int? ID)
        {
            var result = db.sp_ProductImage_Select(Settings.SetNull(Lang), Settings.SetNull(UserName), ProductID, ID).ToList();
            return result;
        } // List
        [HttpGet]
        public List<sp_ProductImage_Select_Result> Get(string Lang, string UserName, int ID)
        {
            var list = db.sp_ProductImage_Select(Settings.SetNull(Lang), Settings.SetNull(UserName),null, ID).ToList();
            return list;
        }
    } // class
} //End namespace