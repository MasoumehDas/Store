using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace API.Models
{
	public class BillPaymentRequestModel
	{
		[MinLength(0), MaxLength(25)]
		public string LoginAccount { get; set; }

		[Display(Name = "شناسه قبض")]
		[MinLength(7), MaxLength(13)]
		[Required(AllowEmptyStrings = false, ErrorMessage = "شناسه قبض ضروری است")]
		public string BillId { get; set; }

		[MinLength(7), MaxLength(13)]
		[Display(Name = "شناسه پرداخت")]
		[Required(AllowEmptyStrings = false, ErrorMessage = "شناسه پرداخت ضروری است")]
		public string PayId { get; set; }
	}
}