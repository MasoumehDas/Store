using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Data.SqlClient;
using System.Data;

public partial class _Default : System.Web.UI.Page
{
    public static string strcon = @"Data Source=.\SQLEXPRESS;AttachDbFilename=|DataDirectory|\Database.mdf;Integrated Security=True;User Instance=True";
    public static SqlConnection conn = new SqlConnection(strcon);

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);
        base.Load += new EventHandler(Page_Load);
    }
    protected void Page_Load(object sender, EventArgs e)
    {


    }
    [WebMethod]
    public static bool SaveData(string editor)
    {
        return SaveContent(editor);
    }
    [WebMethod]
    public static bool SaveImage(string imgurl)
    {
        return SaveImageData(imgurl);
    }
    

    public static bool SaveContent(string content)
    {
        try
        {
            
            string query = "SaveBody";
            SqlDataAdapter da = new SqlDataAdapter(query, conn);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@content", content);
            da.SelectCommand.Parameters.AddWithValue("@date", DateTime.Now.ToShortTimeString());
            if (conn.State != ConnectionState.Open)
                conn.Open();
            da.SelectCommand.ExecuteNonQuery();
            return true;
        }
        catch { return false; }
        finally { if (conn.State != ConnectionState.Closed) conn.Close(); }
    }

    public static bool SaveImageData(string content)
    {
        try
        {
            string query = "SaveImageData";
            SqlDataAdapter da = new SqlDataAdapter(query, conn);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@imgurl", content);
            if (conn.State != ConnectionState.Open)
                conn.Open();
            da.SelectCommand.ExecuteNonQuery();
            return true;
        }
        catch { return false; }
        finally { if (conn.State != ConnectionState.Closed) conn.Close(); }
    }
    
}