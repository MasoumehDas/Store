using API.Models;
using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using ConfirmBank.ir.shaparak.pec1;
using ConfirmBank.ir.shaparak.pec;
using ConfirmBank.ir.mizbansms.my;
using ConfirmBank.Models;
using ConfirmBank.Common;

namespace ConfirmBank.Controllers
{
    public class IndexController : Controller
    {
       
        StoreEntities db = new StoreEntities();

        Log log = new Log();


        public ActionResult Index(PaymentCallbackModel model)
        {
            log.WriteErrorLog($"Parsian PGW service call PaymentCallback ورود مدل");
            if (model != null)
            {
                var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(model);

                log.WriteErrorLog($"Parsian PGW service call PaymentCallback : {jsonString}");
                var callBackViewModel = new PaymentCallBackViewModel()
                {
                    Amount = model.Amount,
                    HashCardNumber = model.HashCardNumber,
                    OrderId = model.OrderId,
                    RRN = model.RRN,
                    status = model.status,
                    TerminalNo = model.TerminalNo,
                    Token = model.Token,
                    TspToken = model.TspToken
                };
                log.WriteErrorLog($"Parsian PGW service call PaymentCallback 1");
                if (model.status == Constants.ParsianPaymentGateway.Successful && (model.Token > 0))
                {
                    //var shouldConfirmAfterPay = true;
                    log.WriteErrorLog($"Parsian PGW service call PaymentCallback 2");
                    //if (shouldConfirmAfterPay)
                    //{
                    try
                    {
                        var pay = db.Payments.Where(a => a.Token == model.Token.ToString()).FirstOrDefault();
                        var jsonpay = Newtonsoft.Json.JsonConvert.SerializeObject(pay);
                        log.WriteErrorLog($"Parsian PGW service call PaymentCallback 3 " + jsonpay);
                        var Password = db.BankAcounts.Where(a => a.CompanyID == pay.CompanyID).Select(a => a.Password).FirstOrDefault();
                        log.WriteErrorLog($"Parsian PGW service call PaymentCallback -3 " + Password);
                        //ایجاد یک نمونه از سرویس تایید پرداخت
                        using (var confirmSvc = new ConfirmService())
                        {
                            log.WriteErrorLog($"Parsian PGW service call PaymentCallback 4");
                            confirmSvc.Url = ConfigHelper.ParsianPGWConfirmServiceUrl;


                            //ایجاد یک نمونه از نوع پارامتر سرویس تایید پرداخت
                            var confirmRequestData = new ClientConfirmRequestData();

                            //شناسه پذیرندگی باید در فراخوانی سرویس تایید تراکنش پرداخت ارائه شود
                            confirmRequestData.LoginAccount = Password;

                            //توکن باید ارائه شود
                            confirmRequestData.Token = model.Token ?? -1;

                            //فراخوانی سرویس و دریافت نتیجه فراخوانی
                            var confirmResponse = confirmSvc.ConfirmPayment(confirmRequestData);
                            callBackViewModel.ConfirmResponseStatus = confirmResponse.Status;

                            //کنترل کد وضعیت نتیجه فراخوانی
                            //درصورتی که موفق باشد، باید خدمات یا کالا به کاربر پرداخت کننده ارائه شود
                            if (confirmResponse.Status == Constants.ParsianPaymentGateway.Successful)
                            {
                                pay.BankRefrence = model.RRN.ToString();
                                pay.Status = 1;
                                var order = db.PurchaseDetails.Where(a => a.PurchaseID == pay.PurchaseID).ToList();

                                foreach (var item in order)
                                {
                                    var prod = db.Products.Where(a => a.ID == item.ProductID).FirstOrDefault();
                                    if (prod != null)
                                    {
                                        prod.SalesCount = item.ShoppingCount + (prod.SalesCount == null ? 0 : prod.SalesCount);
                                        prod.AvailableCount = prod.AvailableCount - item.ShoppingCount;
                                        prod.UpdateDateAvailableCount = DateTime.Now;
                                        if (prod.AvailableCount <= 0)
                                        {
                                            prod.IsAvailable = false;
                                        }

                                    }
                                }


                                log.WriteErrorLog($"Redirect 500 PurchaseID:" + pay.PurchaseID.ToString());
                                var ord = db.Purchases.Where(a => a.ID == pay.PurchaseID).FirstOrDefault();
                                ord.Status = 1;
                                db.SaveChanges();

                                var customer = db.Customers.Where(a => a.ID == ord.CustomerID).FirstOrDefault();
                                var CustomerID = customer.ID;
                                string url = db.CompanySettings.Where(a => a.SettingName == "UrlFull" && a.CompanyID == ord.CompanyID).Select(a => a.SettingValue).FirstOrDefault();
                                url = url + "/my-purchases?Id=" + CustomerID.ToString();
                                log.WriteErrorLog($"Redirect 500 PurchaseID:" + pay.PurchaseID.ToString() + " URL :" + url);
                                SendMessage(customer, pay.CompanyID);
                                return Redirect(url);
                            }
                        }
                        log.WriteErrorLog($"Parsian PGW service call PaymentCallback 4");
                    }
                    catch (Exception ex)
                    {
                        log.WriteErrorLog("Parsian PGW service call PaymentCallback {ex.Message}" + ex.Message);
                        if (ex.InnerException != null)
                        {
                            log.WriteErrorLog("Parsian PGW service call PaymentCallback {ex.InnerException}" + ex.InnerException.Message);
                        }
                    }


                    //}

                    //بررسی اینکه آیا کاربر باید خدمات یا کالای مورد نظر خود را در قبال وجهی که پرداخت کرده است، دریافت کند
                    //یا دریافت نکند.
                    //در صورتی که مثلاً کاربر سفارش خود را پس از پرداخت وجه، لغو نماید، برای برگشت وجه پرداخت شده اش به حسابش
                    //باید از سرویس برگشت وجه استفاده شود
                    //حداکثر زمان مجاز برای فراخوانی سرویس برگشت وجه به حساب مشتری
                    //که شروع آن پس از دریافت توکن از سرویس درخواست پرداخت می باشد
                    //یک ساعت است

                    //if(no service or product will be delivered to the customer)
                    //call ReversalService.ReversalRequest() method to indicate return of money to customer.
                    //ReversePayment(model.Token ?? 0L);
                }


            }
            else
            {
                log.WriteErrorLog($"Parsian PGW service call PaymentCallback مدل خالی است");


            }
            return View();
        }
       
        private void SendMessage(DataAccess.Customer model, int? CompanyID)
        {
            WSSMS v = new WSSMS();
           
            try
            {


                var setting = db.CompanySettings.Where(a => a.CompanyID == CompanyID && a.Category == "SMS").ToList();

                if (setting != null)
                {
                    string username = setting.Where(a => a.SettingName == "SMSUsername").Select(a => a.SettingValue).FirstOrDefault();
                    string password = setting.Where(a => a.SettingName == "Password").Select(a => a.SettingValue).FirstOrDefault();
                    string Body = setting.Where(a => a.SettingName == "SMSMessage").Select(a => a.SettingValue).FirstOrDefault();
                    string SMSNumber = setting.Where(a => a.SettingName == "SMSNumber").Select(a => a.SettingValue).FirstOrDefault();
                    string StorMessage = setting.Where(a => a.SettingName == "StorMessage").Select(a => a.SettingValue).FirstOrDefault();
                    string api = setting.Where(a => a.SettingName == "api").Select(a => a.SettingValue).FirstOrDefault();
                    string SMSReciveNumber = setting.Where(a => a.SettingName == "SMSReciveNumber").Select(a => a.SettingValue).FirstOrDefault();
                    
                    var result1 = v.sendsms(username, password, model.Mobile, Body, SMSNumber, api);

                    var result2 = v.sendsms(username, password, SMSReciveNumber, StorMessage+" "+ model.FullName, SMSNumber, api);
                    log.WriteErrorLog($"SendSMS  CompanyID:" + CompanyID.ToString() + " result1 :" + result1.First().ToString());
                    log.WriteErrorLog($"SendSMS  CompanyID:" + CompanyID.ToString() + " result2 :" + result2.First().ToString());
                }




            }
            catch (Exception ex)
            {
                log.WriteErrorLog($"SendSMS  CompanyID:" + CompanyID.ToString() + " Error" + ex.Message);
            }


        }
        public ActionResult About()
        {
            //WSSMS v = new WSSMS();
            //var a=  v.sendsms2("mpi_09125572091", "7840566", "09126766025", "dffdf", "50002123262933");
            //var b=  v.sendsms("mpi_09125572091", "7840566", "09126766025", "dffdf", "50002123262933","41");

            return View();
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            Models.Email email = new Models.Email();

            WSSMS v = new WSSMS();
            //email.SendMail(Body, "188.34.147.87", "admin@nikoooo.ir", "Md9126766025", "dastani_m@yahoo.com","", "Test");
            string StorBody = "" + " " + "یک خرید پرداخت شده در سیستم دارد." + Environment.NewLine;
            StorBody += " شماره مشتری :" + "";
            var setting = db.CompanySettings.Where(a => a.CompanyID == 1 && a.Category == "SMS").ToList();

            if (setting != null)
            {
                string username = setting.Where(a => a.SettingName == "SMSUsername").Select(a => a.SettingValue).FirstOrDefault();
                string password = setting.Where(a => a.SettingName == "Password").Select(a => a.SettingValue).FirstOrDefault();
                string Body = setting.Where(a => a.SettingName == "SMSMessage").Select(a => a.SettingValue).FirstOrDefault();
                string SMSNumber = setting.Where(a => a.SettingName == "SMSNumber").Select(a => a.SettingValue).FirstOrDefault();
                string api = setting.Where(a => a.SettingName == "api").Select(a => a.SettingValue).FirstOrDefault();
                string Mobile = setting.Where(a => a.SettingName == "SMSReciveNumber").Select(a => a.SettingValue).FirstOrDefault();
                string StorMessage = setting.Where(a => a.SettingName == "StorMessage").Select(a => a.SettingValue).FirstOrDefault();
                var result1 = v.sendsms(username, password, Mobile, StorMessage, SMSNumber, api);
                var result2 = v.sendsms(username, password, Mobile, StorMessage, SMSNumber, api);
                log.WriteErrorLog($" result1 :" + result1.First().ToString());
                log.WriteErrorLog($" result2 :" + result2.First().ToString());

            }

            return View();
        }
    }
}