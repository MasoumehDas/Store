using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public class Message_
    {
        public int clientuniqueid { get; set; }
        public string type { get; set; }
        public string message { get; set; }
        public DateTime date { get; set; }
    }
    public class RepositoryChat
    {
        //SqlConnection co = new SqlConnection(System.Web.Configuration.WebConfigurationManager.ConnectionStrings["con"].ConnectionString);
        SqlConnection co = new SqlConnection(" Data Source =.; Initial Catalog = Chatter; Integrated Security = True");
       
        public List<Message_> GetAllMessages()
        {
            var messages = new List<Message_>();
            using (var cmd = new SqlCommand(@"SELECT    
                [Message],[Person_ID] FROM [dbo].[Message]", co))
            {
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                var dependency = new SqlDependency(cmd);
                dependency.OnChange += new OnChangeEventHandler(dependency_OnChange);
                DataSet ds = new DataSet();
                da.Fill(ds);
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    messages.Add(item: new Message_
                    {
                        clientuniqueid = int.Parse(ds.Tables[0].Rows[i][0].ToString()),
                        message = ds.Tables[0].Rows[i][1].ToString(),
                       
                    });
                }
            }
            return messages;
        }

        private void dependency_OnChange(object sender, SqlNotificationEventArgs e) //this will be called when any changes occur in db table. 
        {
            if (e.Type == SqlNotificationType.Change)
            {
                MyHub.NewMessage();
            }
        }
    }
}