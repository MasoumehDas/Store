using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace API.Models
{
	public class PaymentCallBackViewModel : PaymentCallbackModel
	{
		[Display(Name = "کد پاسخ سرویس تایید تراکنش")]
		[DisplayFormat(NullDisplayText = "NULL")]
		public short? ConfirmResponseStatus { get; set; }
	}
}