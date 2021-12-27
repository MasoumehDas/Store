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
    public class UpdateProductGroupDetailController : ApiController
    {
        StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        [HttpGet]
        public string Get(string BasicDataGrouptype
        , int? ID
        , bool? IsShowSearch
        , int? ProductGroupID
        )
        {
            try
            {
                DataAccess.ProductGroupDetail model = db.ProductGroupDetails.Where(a => a.ID == ID).FirstOrDefault();
                model.GroupTypeName = Settings.SetNull(BasicDataGrouptype);
                model.IsShowSearch = IsShowSearch;
                model.ProductGroupID = ProductGroupID;
                var dd = db.SaveChanges();
                return "0";
            }
            catch (Exception ex)
            {
                Models.Log log = new Models.Log();
                log.WriteErrorLog(" UpdateProductGroupDetail :" + ex.Message);
                if (ex.InnerException != null)
                {
                    log.WriteErrorLog(" UpdateProductGroupDetail InnerException :" + ex.InnerException.Message);
                    return ex.InnerException.Message;
                }
                else
                {
                    return ex.Message;
                }
            }
        }
    }
}
