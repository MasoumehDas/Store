using DataAccess;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using Telegram.Bot;

namespace API.Models
{
    
    public static class Settings
    {

        public static string SetNull(this string Value)
        {
            if (Value == "null" || Value == "")
            {
                return null;
            }
            else
            {
                return Value;
            }
        }
      
        public static string Decrypt(string value)
        {

            return (value != "" && value != null) ? Encryption.Decrypt(Settings.SetNull(value), "sblw-3hn8-sqoy19") : "";
        }
        public static string Encrypt(string value)
        {

            return (value != "" && value != null) ? Encryption.Encrypt(Settings.SetNull(value), "sblw-3hn8-sqoy19") : "";
        }
        public static bool ValidatePassword(string password, out string ErrorMessage)
        {
            var input = password;
            ErrorMessage = string.Empty;

            if (string.IsNullOrWhiteSpace(input))
            {
                throw new Exception("Password should not be empty");
            }

            var hasNumber = new Regex(@"[0-9]+");
            var hasUpperChar = new Regex(@"[A-Z]+");
            var hasMiniMaxChars = new Regex(@".{8,15}");
            var hasLowerChar = new Regex(@"[a-z]+");
            //var hasSymbols = new Regex(@"[!@#$%^&*()_+=\[{\]};:<>|./?,-]");

            if (!hasLowerChar.IsMatch(input))
            {
                ErrorMessage = "Password should contain at least one lower case letter.";
                return false;
            }
            else if (!hasUpperChar.IsMatch(input))
            {
                ErrorMessage = "Password should contain at least one upper case letter.";
                return false;
            }
            else if (!hasMiniMaxChars.IsMatch(input))
            {
                ErrorMessage = "Password should not be lesser than 8 or greater than 15 characters.";
                return false;
            }
            else if (!hasNumber.IsMatch(input))
            {
                ErrorMessage = "Password should contain at least one numeric value.";
                return false;
            }

            //else if (!hasSymbols.IsMatch(input))
            //{
            //    ErrorMessage = "Password should contain at least one special case character.";
            //    return false;
            //}
            else
            {
                return true;
            }
        }

        public static string WebsiteName()
        {
            string WebSite = HttpContext.Current.Request.UrlReferrer.Host;
            int Port = HttpContext.Current.Request.UrlReferrer.Port;

            if (Port != 80 && Port!=443)
            {
                WebSite = WebSite + ":" + Port.ToString();
            }
            if (WebSite == "localhost:4300")
            {
                WebSite = System.Configuration.ConfigurationManager.AppSettings["apiUrl"];
            }
            if (WebSite == "localhost:4500")
            {
                WebSite = System.Configuration.ConfigurationManager.AppSettings["apiUrl5"];
            }
            WebSite = WebSite.ToLower().Replace("www.", "");
            WebSite = WebSite.ToLower().Replace("panel.", "");
            Models.Log log = new Models.Log();
            log.WriteErrorLog(" WebSite :" + WebSite);
            return WebSite;
        }
        public static String GetIP()
        {
            String ip =
                HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (string.IsNullOrEmpty(ip))
            {
                ip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            Models.Log log = new Models.Log();
            log.WriteErrorLog(" ip :" + ip);
            return ip;
        }
        static TelegramBotClient bot;
        public static async Task<string> sendMessge(int CompanyID, string FullName)
        {
            try
            {

                StoreEntities db = new StoreEntities();
                var comp = db.Companies.Where(a => a.ID == CompanyID).FirstOrDefault();
                if (comp.TelegramUserChatID != null)
                {

                    string Token = "1698691757:AAFZnAee1dmmbWGhRGknHQMaLEJDXK3JK1c";
                    if (comp.TelegramBotToken != null)
                    {
                        Token = comp.TelegramBotToken;
                    }
                    bot = new TelegramBotClient(Token);

                    var responce = await bot.SendTextMessageAsync(comp.TelegramUserChatID, FullName + " یک درخواست سفارش داد ");


                }
            }
            catch (Exception ex)
            {
                API.Models.Log log = new API.Models.Log();
                log.WriteErrorLog(" Telegram CompanyID: " + CompanyID.ToString() + ex.Message);
                if (ex.InnerException != null)
                {
                    log.WriteErrorLog(" Telegram InnerException :" + ex.InnerException.Message);
                    return ex.InnerException.Message;
                }
                else
                {
                    return ex.Message;
                }
            }
            return "0";
        }
        public static void ResizeImageInstagram(string UrlImage, int width, int height,string ID)
        {
            
            string uploadPath = System.Configuration.ConfigurationManager.AppSettings["DocumentUrl"];
            
            //Bitmap bmp = (Bitmap)Bitmap.FromFile(@"C:\testimage.bmp");
            Bitmap bmp = (Bitmap)Bitmap.FromFile(uploadPath+UrlImage);

            Bitmap newImage = ResizeBitmap(bmp, width, height);
            string NewName = uploadPath + @"\Instagram\" + ID+ ".jpg";

            newImage.Save(NewName);
        }
        private static Bitmap ResizeBitmap(Bitmap bmp, int width, int height)
        {
            Bitmap result = new Bitmap(width, height);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.DrawImage(bmp, 0, 0, width, height);
                g.Dispose();
            }

            return result;
        }
        private static System.Drawing.Image resizeImage(System.Drawing.Image imgToResize, Size size)
        {
            //Get the image current width
            int sourceWidth = imgToResize.Width;
            //Get the image current height
            int sourceHeight = imgToResize.Height;

            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;
            //Calulate  width with new desired size
            nPercentW = ((float)size.Width / (float)sourceWidth);
            //Calculate height with new desired size
            nPercentH = ((float)size.Height / (float)sourceHeight);


            if (nPercentH < nPercentW)
                nPercent = nPercentH;
            else
                nPercent = nPercentW;
            //New Width
            int destWidth = (int)(sourceWidth * nPercent);
            //New Height
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap b = new Bitmap(destWidth, destHeight);
            Graphics g = Graphics.FromImage((System.Drawing.Image)b);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            // Draw image with new width and height
            g.DrawImage(imgToResize, 0, 0, destWidth, destHeight);
            g.Dispose();

            return (System.Drawing.Image)b;
        }
        public static System.Drawing.Image resizeImage(System.Drawing.Image img, int height,int Width)
        {
            Bitmap b = new Bitmap(img);
            System.Drawing.Image i = resizeImage(b, new Size(height, Width));
            return i;
        }
    }
}