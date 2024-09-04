using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace API.Controllers
{

    public class UploaderController : ApiController
    {
        [HttpPost]


        public string Post()
        {
            string FileName = null;
            string uploadPath = System.Configuration.ConfigurationManager.AppSettings["DocumentUrl"];
            var httpRequest = System.Web.HttpContext.Current.Request;
            //Upload Image
            var postedFile = httpRequest.Files[0];
            string FolderName = httpRequest.Form["FolderName"];
            string path = httpRequest.Form["path"];
            string Height = httpRequest.Form["imageHeight"];
            string Width = httpRequest.Form["imageWidth"];

            uploadPath = uploadPath + FolderName;
            //--------------ارسال فایل تصویر
            if (!Path.GetExtension(postedFile.FileName).ToLower().Contains("mp4"))
            {
                Image imgFile = System.Drawing.Image.FromStream(postedFile.InputStream);


                Bitmap img = new Bitmap(imgFile);

                
                var imageHeight = img.Height;
                var imageWidth = img.Width;

                if ((imageHeight.ToString() == Height && imageWidth.ToString() == Width) || (Height == null))
                {
                    //Create custom filename
                    if (postedFile != null)
                    {
                        FileName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
                        FileName = FileName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);

                    }
                    // Determine whether the directory exists.
                    if (!Directory.Exists(uploadPath))
                    {

                        DirectoryInfo di = Directory.CreateDirectory(uploadPath);
                    }

                    var filePath = uploadPath + FileName;


                    Graphics graphics = Graphics.FromImage(img);

                    Brush brush = new SolidBrush(Color.Yellow);



                    int fontSize = 0;


                    string text = "DASTANI CARPET";

                    int h = 100;

                    if (imageHeight > 300)
                    {
                        h = (imageHeight / 4);

                    }
                    else
                    {
                        h = (imageHeight / 3);

                    }
                    int w = 100;
                    if (imageWidth > 500)
                    {

                        w = imageWidth / 3;
                        fontSize = 40;
                    }
                    else
                    {
                        w = imageWidth / 12;
                        fontSize = 30;
                    }
                    Font arial = new Font("Tahoma", fontSize, FontStyle.Regular);
                    Point point = new Point(w, h);
                    Size size = new Size(350, 200);
                    Rectangle rectangle = new Rectangle(point, size);
                    graphics.DrawString(text, arial, brush, rectangle);

                    //Font font = new Font("Arial", 50, FontStyle.Italic, GraphicsUnit.Pixel);
                    ////Color color = Color.FromArgb(255, 255, 0, 0);
                    //int opacity = 128;
                    //Point atpoint = new Point(imageWidth / 2, imageHeight / 2);
                    //SolidBrush brush = new SolidBrush(Color.FromArgb(opacity, Color.Black));
                    //Graphics graphics = Graphics.FromImage(img);
                    //StringFormat sf = new StringFormat();
                    //sf.Alignment = StringAlignment.Center;
                    //sf.LineAlignment = StringAlignment.Center;
                    //graphics.DrawString("فرش داستانی", font, brush, atpoint, sf);
                    graphics.Dispose();

                    img.Save(filePath, imgFile.RawFormat);

                    
                   var imgFile_Compressed = GetCompressedBitmap(img, 256);
                    
                    var filePath_Compressed = uploadPath +"/zip/"+ imgFile_Compressed;
                    imgFile_Compressed.Save(filePath_Compressed, imgFile_Compressed.RawFormat);

                }

                else
                {
                    return "Error";
                }
            }
            else //----------ارسال فایل ویدیو
            {

                //Create custom filename
                if (postedFile != null)
                {
                    FileName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
                    FileName = FileName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);

                }
                // Determine whether the directory exists.
                if (!Directory.Exists(uploadPath))
                {

                    DirectoryInfo di = Directory.CreateDirectory(uploadPath);
                }

                var filePath = uploadPath + FileName;
                postedFile.SaveAs(filePath);

            }

            return path + FileName;
        }

        private Image GetCompressedBitmap(Bitmap bmp, long quality)
        {
            using (var mss = new MemoryStream())
            {
                EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
                ImageCodecInfo imageCodec = ImageCodecInfo.GetImageEncoders().FirstOrDefault(o => o.FormatID == ImageFormat.Jpeg.Guid);
                EncoderParameters parameters = new EncoderParameters(1);
                parameters.Param[0] = qualityParam;
                bmp.Save(mss, imageCodec, parameters);
                return Image.FromStream(mss);
            }
        }


    }
}
