export class Order {
  Email: string|undefined | undefined = undefined;
  Mobile: string | undefined = undefined;
  Address: string | undefined = undefined;
  FullName: string | undefined = undefined;
  Description: string | undefined = undefined;
  CustomerID: Number | undefined = undefined;
  City: string | undefined = undefined;
  CodeMelli: string | undefined = undefined;
  Lang: string | undefined = undefined;
  LogUser: string | undefined = undefined;
  CompanyID: string | undefined = undefined;
  TotalDiscount: Number | undefined = undefined;
  Total: Number | undefined = undefined;
  OrderDetails: OrderDetails[] | undefined = undefined;
}

export class OrderDetails {

  OrderID: Number | undefined = undefined;
  ProductID: Number | undefined = undefined;
  ProducName: string | undefined = undefined;
  ShoppingCount: Number | undefined = undefined;
  AvalaibleCount: Number | undefined = undefined;
  UnitPrice: Number | undefined = undefined;
  TotalPrice: Number | undefined = undefined;
  TotalDiscount: Number | undefined = undefined;
  Total: Number | undefined = undefined;


}
export class PaymentRequestResponseModel
	{
		status: Number | undefined = undefined;
		Message: string | undefined = undefined;
    Token: Number | undefined = undefined;
    location:string | undefined = undefined;
	}
