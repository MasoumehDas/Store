using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Models;
using DataAccess;
namespace Api.Controllers.Sales
{
    public class PageCountController : ApiController
    {
        DataAccess.StoreEntities db = new StoreEntities();


        [HttpGet]
        public List<Pagging> Get(int CompanyID, int ProductGroupID)
        {
            List<Pagging> list = new List<Pagging>();
            var PageCount = db.Settings.Where(a => a.SettingKey == "PageCount").Select(a => a.SettingValue).FirstOrDefault();
            int TotlaPage = db.Products.Where(a => a.CompanyID == CompanyID && a.ProductGroupID == ProductGroupID && a.Acive == true).Count();
            int Page = TotlaPage / Convert.ToInt32(PageCount);
            for(int i=1; i<= Page+1;i++)
            {
                Pagging p = new Pagging();
                if(i==1)
                {
                    p.Active = true;
                    p.FirstPage = true;
                    p.LastPage = false;
                }
                else
                {
                    p.Active = false;
                    p.FirstPage = false;
                }
                p.pageNumber = i;
                if(i== Page + 1)
                {
                    p.LastPage = true;
                }
                else
                {
                    p.LastPage = false;
                }
                list.Add(p);

            }
            return list;
        }
        public class Pagging
        {
            public int pageNumber { get; set; }
            public bool Active { get; set; }
            public bool LastPage { get; set; }
            public bool FirstPage { get; set; }
        }
    }
}
