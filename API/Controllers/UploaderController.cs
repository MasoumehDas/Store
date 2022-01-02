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
                System.Drawing.Image imgFile = System.Drawing.Image.FromStream(postedFile.InputStream);


                Bitmap img = new Bitmap(imgFile);
                if (!Path.GetExtension(postedFile.FileName).ToLower().Contains("png"))
                {
                    imgFile = GetCompressedBitmap(img, 1024);
                }
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
                    //postedFile.SaveAs(filePath);
                    
                   
                    img.Save(filePath, imgFile.RawFormat);
                    Bitmap bmp = (Bitmap)Bitmap.FromFile(@"C:\testimage.bmp");
                    Bitmap newImage = ResizeBitmap(bmp, 512, 512);

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
        private Bitmap ResizeBitmap(Bitmap bmp, int width, int height)
        {
            Bitmap result = new Bitmap(width, height);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.DrawImage(bmp, 0, 0, width, height);
            }

            return result;
        }

    }
}
