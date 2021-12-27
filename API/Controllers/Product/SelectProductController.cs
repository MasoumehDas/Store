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
    public class SelectProductController : ApiController
    {
        StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        [HttpGet]


        public List<sp_Product_Panel_Select_Result> Get(string UserName, string Lang, int? ID, int? CompanyID, int? ProductGroupID,string BarCode,string Name,
           bool? IsAvailable, bool? Acive, bool? IsViewTelegram, bool? IsViewInstagram, bool? IsSendInstagram, bool? IsSendTelegram, bool? IsSpecialSales,string Specification)
        {
            var result = db.sp_Product_Panel_Select(UserName,Lang,ID,CompanyID,ProductGroupID
                , Settings.SetNull(BarCode), Settings.SetNull(Name),IsAvailable,Acive,IsViewTelegram,
                IsViewInstagram,IsSendInstagram,IsSendTelegram,IsSpecialSales, Settings.SetNull(Specification)).ToList();
            return result;
        } // List
        [HttpGet]
        public List<sp_Product_Panel_Select_Result> Get(string Lang, string UserName, int ID)
        {
            var list = db.sp_Product_Panel_Select(UserName, Lang, ID, null, null, null, null, null, null, null, null,null,null,null, null).ToList();
            return list;
        }
    } // class
} //End namespace