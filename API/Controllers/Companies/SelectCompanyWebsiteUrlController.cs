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
    public class SelectCompanyWebsiteUrlController : ApiController
    {
        StoreEntities db = new StoreEntities();
        Models.Log log = new Models.Log();
        [HttpGet]
        
        public List<sp_Company_Select_Result> Get(string Lang, string UserName, string WesiteUrl)
        {
            //WesiteUrl = HttpContext.Current.Request.UrlReferrer.AbsoluteUri;
            try
            {
                WesiteUrl = Settings.WebsiteName();
                var list = db.sp_Company_Select(Lang, Settings.SetNull(UserName), Settings.GetIP(), null, null, null, null, null, null, WesiteUrl).ToList();
                return list;
            }
            catch (Exception ex)
            {
                Models.Log log = new Models.Log();
                log.WriteErrorLog(" SelectCompanyWebsiteUrl :" + ex.Message);
                if (ex.InnerException != null)
                {
                    log.WriteErrorLog(" SelectCompanyWebsiteUrl InnerException :" + ex.InnerException.Message);
                    
                }
                
            }
            return null;
        }


    }
}
