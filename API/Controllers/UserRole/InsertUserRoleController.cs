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
    public class InsertUserRoleController : ApiController
    {
        private StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        public string Get(
            
            Nullable<int> ParentLangID,
            string RoleName,
            Nullable<bool> Active,
            string Lang,
            string LogUser

         )
        {
            try
            {
                DataAccess.UserRole model = new DataAccess.UserRole();
                model.CreateDate= DateTime.Now;
                model.RoleName = Settings.SetNull(RoleName);
                model.Lang = Settings.SetNull(Lang);
                model.LogUser = Settings.SetNull(LogUser);
                model.ParentLangID = ParentLangID;
                model.Active = Active;
                db.UserRoles.Add(model);
                var dd = db.SaveChanges();
                return "0";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string Get(

            string RoleName,
           
            string Lang,
            string LogUser

         )
        {
            try
            {
                DataAccess.UserRole model = new DataAccess.UserRole();
                model.CreateDate = DateTime.Now;
                model.RoleName = Settings.SetNull(RoleName);
                model.Lang = Settings.SetNull(Lang);
                model.LogUser = Settings.SetNull(LogUser);
                
                model.Active = true;
                db.UserRoles.Add(model);
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
