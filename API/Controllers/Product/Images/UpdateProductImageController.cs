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
    public class UpdateProductImageController : ApiController
    {
        StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        [HttpGet]
        public string Get(string Description
        , int? ID
        , string Image_Url
        , bool? IsDefault
        , int? ProductID
        )
        {
            try
            {
                DataAccess.ProductImage model = db.ProductImages.Where(a => a.ID == ID).FirstOrDefault();
                model.Description = Settings.SetNull(Description);
                model.Image_Url = Settings.SetNull(Image_Url);
                model.IsDefault = IsDefault;
                model.ProductID = ProductID;
                var dd = db.SaveChanges();
                return "0";
            }
            catch (Exception ex)
            {
                Models.Log log = new Models.Log();
                log.WriteErrorLog(" InsertProductImage :" + ex.Message);
                if (ex.InnerException != null)
                {
                    log.WriteErrorLog(" InsertProductImage InnerException :" + ex.InnerException.Message);
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
