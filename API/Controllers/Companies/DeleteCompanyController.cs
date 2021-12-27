using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
namespace API.Controllers.Companies
{
    public class DeleteCompanyController : ApiController
    {
        StoreEntities db = new StoreEntities();
        [HttpGet]

        public string Get(string UserName,string Lang, int ID)
        {

            try
            {
                int count = db.Companies.Where(a => a.ID == ID && a.IsDefault == true).Count();
                if(count==0)
                {
                    var gg = db.Companies.Where(a => a.ID == ID).FirstOrDefault();

                    db.Companies.Remove(gg);
                    var dd = db.SaveChanges();
                    return "0";
                }
                else
                {
                    string ms = Lang == "fa" ? "شرکت پیش فرض قابل حذف نمی باشد" : "The default company cannot be deleted";
                    return ms;
                }
                


                
            }
            catch (Exception ex)
            {
                return ex.Message;
            }



        }
    }
}
