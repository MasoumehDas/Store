using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;

public partial class View : System.Web.UI.Page
{
    public static string strcon = @"Data Source=.\SQLEXPRESS;AttachDbFilename=|DataDirectory|\Database.mdf;Integrated Security=True;User Instance=True";
    public static SqlConnection conn = new SqlConnection(strcon);

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        GetLastItem();
        GetImage();
    }

    public void GetImage()
    {
        string query = "GetLastImage";
        SqlDataAdapter da = new SqlDataAdapter(query, conn);
        da.SelectCommand.CommandType = CommandType.StoredProcedure;
        DataSet ds = new DataSet();
        if (conn.State != ConnectionState.Open)
            conn.Open();
        da.Fill(ds, query);
        if (conn.State != ConnectionState.Closed) conn.Close();
        if (ds.Tables[0].Rows.Count > 0)
        {
            Image1.ImageUrl = ds.Tables[0].Rows[0]["imgdata"].ToString();
        }
    }

    public void GetLastItem()
    {
        string query = "GetLastItem";
        SqlDataAdapter da = new SqlDataAdapter(query, conn);
        da.SelectCommand.CommandType = CommandType.StoredProcedure;
        DataSet ds = new DataSet();
        if (conn.State != ConnectionState.Open)
            conn.Open();
        da.Fill(ds, query);
        if (conn.State != ConnectionState.Closed) conn.Close();
        if (ds.Tables[0].Rows.Count > 0)
        {
            Literal1.Text = ds.Tables[0].Rows[0]["body"].ToString();
        }
    }

}