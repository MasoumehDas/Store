using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.SalePayment
{
	public class ReversalResponseViewModel
	{
		public short? Status { get; set; }
		public string Message { get; set; }
	}
}