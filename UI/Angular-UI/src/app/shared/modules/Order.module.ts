export class Order {
  Email: string;
  Mobile: string;
  Address: string;
  FullName: string;
  Description: string;
  CustomerID: Number;
  City: string;
  Lang: string;
  LogUser: string;
  CompanyID: string;
  Total: Number;
  OrderDetails: OrderDetails[];
}

export class OrderDetails {

  OrderID: Number;
  ProductID: Number;
  ProducName: string;
  ShoppingCount: Number;
  AvalaibleCount: Number;
  UnitPrice: Number;
  TotalPrice: Number;
  Total: Number;


}
