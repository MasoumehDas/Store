using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
using API.Models;
namespace API.Controllers.UserRole
{
    public class UpdateUserRoleController : ApiController
    {
        private StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        public string Get(
            int ID,
            Nullable<int> ParentLangID,
            string RoleName,
            Nullable<bool> Active,
            string Lang,
            string LogUser

         )
        {
            try
            {
                DataAccess.UserRole model = db.UserRoles.Where(a => a.ID == ID).FirstOrDefault();
                model.UpdateDate = DateTime.Now;
                model.RoleName = Settings.SetNull(RoleName);
                model.Lang = Settings.SetNull(Lang);
                model.LogUser = Settings.SetNull(LogUser);
                model.ParentLangID = ParentLangID;
                model.Active = Active;

                var dd = db.SaveChanges();
                return "0";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
