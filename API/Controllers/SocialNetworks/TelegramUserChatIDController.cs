using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
using API.Models;

using static API.Models.Settings;
using System.Threading.Tasks;
using Telegram.Bot.Types;
using System.IO;
using Telegram.Bot;
using Newtonsoft.Json;
using Api.Models;

namespace Api.Controllers.SocialNetworks
{
    public class TelegramUserChatIDController : ApiController
    {
        static TelegramBotClient bot;
        API.Models.Log log = new API.Models.Log();
        string url = "https://api.telegram.org/bot1698691757:AAFZnAee1dmmbWGhRGknHQMaLEJDXK3JK1c/getUpdates";
       
        [HttpGet]
        public async Task<string> Get(int CompanyID)
        {
            try
            {
                
                StoreEntities db = new StoreEntities();
                string WebSite = Settings.WebsiteName();
                CompanyID = db.Companies.Where(a => a.WebsiteUrl == WebSite).Select(a => a.ID).FirstOrDefault();
                var comp = db.Companies.Where(a => a.ID == CompanyID).FirstOrDefault();
                if (comp.TelegramUserName != null && comp.TelegramUserChatID==null)
                {
                    string Token = "1698691757:AAFZnAee1dmmbWGhRGknHQMaLEJDXK3JK1c";
                    if (comp.TelegramBotToken != null)
                    {
                        Token = comp.TelegramBotToken;
                    }
                    string url = "https://api.telegram.org/bot"+ Token+"/getUpdates";
                    Uri baseAddress = new Uri(url);
                    string content;
                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = baseAddress;
                        client.DefaultRequestHeaders.Accept.Clear();
                        var w = client.GetAsync(url);
                        w.Wait();
                        HttpResponseMessage response = w.Result;
                        content = await response.Content.ReadAsStringAsync();
                        var result = JsonConvert.DeserializeObject<Telegramobject>(content);


                        if (result.ok == true)
                        {
                            if (result.result.Count() > 0 )
                            {
                                var list = result.result.Where(a => a.message != null);
                                var  my_id=list.Where(a => a.message.chat.username == comp.TelegramUserName).Select(a => a.message.chat.id).FirstOrDefault();
                                if (my_id.ToString()!="0")
                                {
                                    comp.TelegramUserChatID = my_id.ToString();
                                    db.SaveChanges();
                                    await SendMessage(my_id.ToString(), Token);
                                    return " chat id : " + comp.TelegramUserChatID;
                                }
                                else
                                {
                                    return "هیچ پیامی اخیرا به ربات فرستاده نشده است";
                                }
                                
                            }
                            else
                            {
                                return "هیچ پیامی اخیرا به ربات فرستاده نشده است";
                            }

                        }
                        else
                        {
                            log.WriteErrorLog(" GetTelegramUserChatID CompanyID: " + CompanyID.ToString() + " " + result.error_code + " " + result.description);
                            return "Error " + result.error_code + " " + result.description;
                        }

                        
                    }

                   

                }
                else
                {
                    if (comp.TelegramUserName == null)
                    {
                        return "نام کاربری تلگرام در اطلاعات شرکت ثبت نشده است";
                    }
                    if (comp.TelegramUserChatID != null)
                    {
                        return " chat id : " + comp.TelegramUserChatID;
                    }

                }
            }
            catch (Exception ex)
            {
                log.WriteErrorLog(" GetTelegramUserChatID CompanyID: " + CompanyID.ToString() + ex.Message);
                if (ex.InnerException != null)
                {
                    log.WriteErrorLog(" GetTelegramUserChatID InnerException :" + ex.InnerException.Message);
                    return ex.InnerException.Message;
                }
                else
                {
                    return ex.Message;
                }
            }
            return "";
        }
        private static async Task SendMessage(string id,string Token)
        {
            bot = new TelegramBotClient(Token);


            var result = await bot.SendTextMessageAsync(id, "Your Telegram id : " + id);
            
        }
        
    }



    



}

