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
    public class SelectCompanySetting_ValueController : ApiController
    {
        StoreEntities db = new StoreEntities();
        public string Get(int CompanyID, string SettingName)
        {
            string list = db.CompanySettings.Where(a => a.SettingName == SettingName && a.CompanyID== CompanyID).Select(a => a.SettingValue).FirstOrDefault();
            return list;
        }
    }
}
