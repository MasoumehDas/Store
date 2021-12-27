﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
using System.Web.Http.Cors;
using API.Models;
using System.Web;
using Api.Models;

namespace API.Controllers
{

    public class ProductSelectController : ApiController
    {
        DataAccess.StoreEntities db = new StoreEntities();
        [HttpGet]
        public List<ProductSelect> Get(string lang = null, string loguser = null, string logIP = null, Nullable<bool> isSpecialSales = null,
            Nullable<bool> IsNewCreate = null, Nullable<int> productGroupID = null, Nullable<int> productID = null, Nullable<int> companyID = null,
            string stringParamGroupType = null, string stringParamGroupName = null, Nullable<int> PageNumber = null, string OrderByColumn = null, Nullable<int> OrderDirection = null)
        {
            if (stringParamGroupName == ",,,,")
            {
                stringParamGroupName = null;
            }
            ProductResult model = new ProductResult();
            List<ProductSelect> pro;
            pro= model.SelectProduct(lang, loguser, logIP, false, false, productGroupID, productID, companyID, null, stringParamGroupName, PageNumber, OrderByColumn, OrderDirection);
            return pro;
        }

        
       

    }

}
