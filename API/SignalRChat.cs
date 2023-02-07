using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api
{
    [HubName("MyHub")]
    public class MyHub : Hub
    {

        [HubMethodName("NewMessage")]
        public static void NewMessage()
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MyHub>();
            context.Clients.All.updateMessages();
        }
    }
}