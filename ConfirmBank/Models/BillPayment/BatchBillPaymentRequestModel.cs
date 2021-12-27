using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class BatchBillPaymentRequestModel
    {
		public BatchBillPaymentRequestModel()
		{
			BillItems = new List<Models.BatchBillPaymentRequestItemModel>();
		}

        public List<BatchBillPaymentRequestItemModel> BillItems { get; set; }
    }

    public class BatchBillPaymentRequestItemModel
    {
		public string LoginAccount { get; set; }
		public string BillId { get; set; }
        public string PayId { get; set; }
        public string AdditionalData { get; set; }
    }
}