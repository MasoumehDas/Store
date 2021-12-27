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
    public class InsertPaymentController : ApiController
    {
        StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        [HttpGet]
        public string Get(decimal? Amount
        , string BankName
        , string BankRefrence
        , int? CompanyID
        , string CreateDate_Shamsi
        , string Description
        , string Error
        , int? PaymentType
        , int? PurchaseID
        , int? Status
        )
        {
            try
            {
                DataAccess.Payment model = new DataAccess.Payment();
                model.Amount = Amount;
                model.BankName = Settings.SetNull(BankName);
                model.BankRefrence = Settings.SetNull(BankRefrence);
                model.CompanyID = CompanyID;
                model.CreateDate = DateTime.Now;
                model.CreateDate_Shamsi = Settings.SetNull(CreateDate_Shamsi);
                model.Description = Settings.SetNull(Description);
                model.Error = Settings.SetNull(Error);
                model.PaymentType = PaymentType;
                model.PurchaseID = PurchaseID;
                model.Status = Status;
                db.Payments.Add(model);
                var dd = db.SaveChanges();
                return "0";
            }
            catch (Exception ex)
            {
                Models.Log log = new Models.Log();
                log.WriteErrorLog(" InsertPayment :" + ex.Message);
                if (ex.InnerException != null)
                {
                    log.WriteErrorLog(" InsertPayment InnerException :" + ex.InnerException.Message);
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
