﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
using API.Models;
namespace API.Controllers.Users.UserAccess
{
    public class SelectUserAccessMenuController : ApiController
    {
        StoreEntities db = new StoreEntities();

        [HttpGet]
      
        public List<sp_UserAcessMenu_Select_Result> Get(string Lang, string UserName, int RoleID, string ControlID, bool? Active, bool? IsShow)
        {


            var list = db.sp_UserAcessMenu_Select(Settings.SetNull(Lang), Settings.SetNull(UserName), RoleID, Settings.SetNull(ControlID), Active, IsShow).ToList();
            return list;
        }
    }
}
