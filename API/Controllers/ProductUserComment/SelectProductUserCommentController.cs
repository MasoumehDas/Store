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
    public class SelectProductUserCommentController : ApiController
    {
        StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        [HttpGet]
        public List<sp_ProductUserComment_Select_Result> Get(string Lang, string Loguser, string LogIP, int? ProductID, int? CompanyID, bool? Active)
        {
            var result = db.sp_ProductUserComment_Select(Lang, Loguser, LogIP, ProductID, CompanyID, Active).ToList();
            return result;
        } // List


    } // class
} //End namespace