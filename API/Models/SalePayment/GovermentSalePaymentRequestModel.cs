using Api.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace API.Models
{
	public class GovermentSalePaymentRequestModel: SalePaymentRequestModel
	{
		[MaxLength(30)]
		[MinLength(30)]
		[Required]
		[Display(Name = "Goverment ID")]
		[RegularExpression(@"^\d{30}$",ErrorMessage ="Invalid Goverment ID")]
		public override string AdditionalData { get; set; }
	}
}