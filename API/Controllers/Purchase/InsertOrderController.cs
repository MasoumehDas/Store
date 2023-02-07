using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
using API.Models;
using System.Threading.Tasks;
using Telegram.Bot.Types;
using System.IO;
using Telegram.Bot;
using Api.Models;
using Api.ir.shaparak.pec;
using API.Common;
namespace API.Controllers.Order
{

    public class InsertOrderController : ApiController
    {
        StoreEntities db = new StoreEntities();
        Models.PersianCulture pc = new Models.PersianCulture();
        API.Models.Log log = new API.Models.Log();
        [HttpPost]

        public dynamic Post([FromBody] order model)
        {
            PaymentRequestResponseModel ret = new PaymentRequestResponseModel();
            try
            {


                var customer = db.Customers.Where(a => a.CodeMelli == model.CodeMelli && a.CompanyID == model.CompanyID).FirstOrDefault();
                log.WriteErrorLog(" customer :");
                DataAccess.Customer cust = new Customer();
                if (customer == null)
                {
                    cust.Address = model.Address;
                    cust.Email = model.Email;
                    cust.FullName = model.FullName;
                    cust.Mobile = model.Mobile;
                    cust.City = model.City;
                    cust.CompanyID = model.CompanyID;
                    cust.CodeMelli = model.CodeMelli;
                    db.Customers.Add(cust);

                    db.SaveChanges();
                    model.CustomerID = cust.ID;
                }
                else
                {
                    model.CustomerID = customer.ID;
                }
                DataAccess.Purchase order = new DataAccess.Purchase();
                order.CompanyID = model.CompanyID;
                order.CustomerID = model.CustomerID;
                order.CreateDate = DateTime.Now;
                order.DateShamsi = pc.MiladiToShamsi(DateTime.Now);
                order.Description = model.Description;
                order.Status = 0;
                order.Total = model.Total;
                order.TotalDiscount = model.TotalDiscount;

                db.Purchases.Add(order);
                db.SaveChanges();
                log.WriteErrorLog(" Purchase :"+ order.ID.ToString());

                foreach (var item in model.OrderDetails)
                {
                    var prod = db.Products.Where(a => a.ID == item.ProductID).FirstOrDefault();
                    
                    DataAccess.PurchaseDetail datails = new PurchaseDetail();
                    datails.AvalaibleCount = item.AvalaibleCount;
                    datails.ProducName = item.ProducName;
                    datails.ProductID = item.ProductID;
                    datails.PurchaseID = order.ID;
                    datails.ShoppingCount = item.ShoppingCount;
                    datails.TotalPrice = item.TotalPrice;
                    datails.UnitPrice = item.UnitPrice;
                    if (prod != null)
                    {
                        datails.UnitDiscount = prod.OffPercent;
                    }
                    
                    datails.TotalUnitDisount = item.TotalDiscount;
                    db.PurchaseDetails.Add(datails);



                }

                db.SaveChanges();
                log.WriteErrorLog(" InsertOrder order.ID :" + order.ID.ToString());
                //--------------------------------ورود به درگاه بانک------------------------------------
                SalePaymentRequestModel model_bank = new SalePaymentRequestModel();
                
                var info = db.BankAcounts.Where(a => a.CompanyID == model.CompanyID && a.Active == true).FirstOrDefault();
                if (info != null)
                {
                    model_bank.Amount = Convert.ToInt64(model.Total*10)-Convert.ToInt64(model.TotalDiscount*10);
                    model_bank.LoginAccount = info.Password;
                    model_bank.ConfirmAfterPayment = true;
                    model_bank.AdditionalData = order.ID.ToString() + "," + model.CompanyID.ToString() + "," + model.FullName;
                    model_bank.Originator = model.Mobile;

                    model_bank.CallBackUrl = info.ReturnURL;

                    log.WriteErrorLog("Send to bank InsertOrder order.ID" + order.ID.ToString());
                    return SendToBank(model_bank);
                    

                }
                else
                {
                    //----------------ارسال پیام به تلگرام----------------
                    Settings.sendMessge(model.CompanyID, model.FullName);

                    return Json(new
                    {

                        status = 10,

                    });
                }


            }
            catch (Exception ex)
            {
                
                log.WriteErrorLog(" InsertOrder :" + ex.Message);
                if (ex.InnerException != null)
                {
                    log.WriteErrorLog(" InsertOrder InnerException :" + ex.InnerException.Message);
                    //ret.Message = ex.InnerException.Message;
                    //ret.Status = -1;
                    //return ret;
                    return Json(new
                    {
                        Message = ex.InnerException.Message,
                        status = -1,

                    });
                }
                else
                {
                    //ret.Message = ex.Message;
                    //ret.Status = -1;
                    //return ret;

                    return Json(new
                    {
                        Message = ex.Message,
                        status = -1,
                    
                    });
                }
            }

        }

        private dynamic SendToBank(API.Models.SalePaymentRequestModel model_bank)
        {
            string[] info = model_bank.AdditionalData.Split(',');
            DataAccess.Payment payment = new DataAccess.Payment();
            payment.Amount = model_bank.Amount;
            payment.BankName = "تجارت الکترنیک پارسیان";
            payment.CompanyID = Convert.ToInt32(info[1]);
            payment.CreateDate = DateTime.Now;
            payment.CreateDate_Shamsi = pc.MiladiToShamsi(DateTime.Now);
            payment.PaymentType = 1;
            payment.PurchaseID = Convert.ToInt32(info[0]);
            payment.Status = 0;
            payment.Description = model_bank.AdditionalData;
            db.Payments.Add(payment);
            db.SaveChanges();


            long token = 0;
            short paymentStatus = Int16.MinValue;
            ClientPaymentResponseDataBase responseData = null;
            using (var service = new SaleService())
            {
                //it is not recommended to bypass Server Certificate Validation, due to vaiolating security concerns.
                System.Net.ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback((o, xc, xch, sslP) => true);


                //set Service Url from your application configuration
                service.Url = ConfigHelper.ParsianPGWSaleServiceUrl;

                //instantiate a new instance of the class containing request parameters
                var saleRequest = new ClientSaleRequestData();



                string loginAccount = model_bank.LoginAccount;

                //-------------------------------------********
                //Session[ConfirmAfterPaymentSessionKey] = model_bank.ConfirmAfterPayment;
                //-------------------------------------********
                //Session[ConfirmServiceUrlSessionKey] = ConfigHelper.ParsianPGWConfirmServiceUrl;
                //-------------------------------------********
                //Session[ReversalServiceUrlSessionKey] = ConfigHelper.ReversalServiceUrl;

                saleRequest.LoginAccount = loginAccount;

                //save LoginAccount into Session, to use in Confirm or Reversal.
                //Please don't do this in your application, this is only for this Sample!
                //-------------------------------------********
                //Session[SaleLoginAccountSessionKey] = loginAccount;


                //make sure you set the CallBackUrl property. because after user has completed Payment on IPG page, it will be redirected to the callback url you provided
                //to get you back result of the user Payment on IPG.
                saleRequest.CallBackUrl = model_bank.CallBackUrl;

                //Amount is not used. you should not assign a value to this property.
                saleRequest.Amount = model_bank.Amount;

                //AdditionalData will be saved in Parsian PGW
                saleRequest.AdditionalData = model_bank.AdditionalData;

                //Mobile Number, Telephone or any property of your user to indicate he/she is ordered this payment request.
                saleRequest.Originator = model_bank.Originator;

                //Order Id MUST be UNIQUE at all times. if a duplicated Order Id is received from your request, you will get Status= -112
                // DateTime.Now.Ticks does not ensures uniqueness of OrderId. consider generate OrderId by a Sequence or Identity field in your database.
                saleRequest.OrderId = payment.ID;

                //it is recommended to save Request before calling service in your application's Data Store.
                //e.g. DataStore.DoSaveRequest(loginAccount, OrderId, amount, addData, originator)


                //call appropriate api based on the documentation provided to you.
                responseData = service.SalePaymentRequest(saleRequest);

                //update response of api call for the request you've saved before.
                //e.g. DataStore.UpdatePaymentRequestResponse(orderId, pgwtoken, pgwStatus).

                paymentStatus = responseData.Status;

                //check Status property of the response object to see if the operation was successful.
                if (responseData.Status == Constants.ParsianPaymentGateway.Successful)
                {
                    //if everything is OK (LoginAccount and your IP address is valid in Parsian PGW), save the token in a data store
                    // to use it for redirectgion of your web site's user to the Parsian IPG (Internet Payment Gateway) page to complete payment.
                    token = responseData.Token;

                    //you must save the token in a data store for subsequent support and api calls.
                    //-------------------------------------********
                    //Session["Token"] = token;


                }
                else
                {
                    API.Models.Log log = new API.Models.Log();
                    log.WriteErrorLog($"Parsian PGW service call status code : {responseData.Status}");

                }
            }

            //if pgwStatus == 0 and pgwToken > 0, redirect user to the Parsian IPG to continue payment flow.
            if (paymentStatus == Constants.ParsianPaymentGateway.Successful && token > 0L)
            {
                //first, save token to your database to be able to track payment process with your business.
                //after successfully retrieved a token from Parsian PGW, redirect user to Parsian IPG to complete the payment operation.
                var pay = db.Payments.Where(a => a.ID == payment.ID).FirstOrDefault();
                pay.Token = token.ToString();
                db.SaveChanges();
                var redirectUrl = string.Format(ConfigHelper.ParsianIPGPageUrl, responseData.Token);
                return Json(new
                {
                    status = 0,
                    location = redirectUrl
                });
            }
            else
            {
                ////------------------------نمایش خطا
                //var mdl = new PaymentRequestResponseModel()
                //{
                //    Message = responseData?.Message,
                //    Status = responseData?.Status,
                //    Token = responseData?.Token
                //};
                //return mdl;
                return Json(new
                {
                    Message = responseData?.Message,
                    status = responseData?.Status,
                    Token = responseData?.Token
                });

            }
        }


    }
}
