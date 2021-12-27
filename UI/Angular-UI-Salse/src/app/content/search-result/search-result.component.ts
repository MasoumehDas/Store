
import { Component, OnInit, Injectable } from '@angular/core';
import { ProductService } from '../../shared/service/product.service';
import { ConfigService } from '../../shared/service/api.service';
import { Product } from '../../shared/modules/Product.module';
import { them } from '../../shared/service/themplate.service';
import { PaymentRequestResponseModel } from '../../shared/modules/Order.module';
import Swal from 'sweetalert2'
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['../../../assets/main.css', './search-result.component.css'],

})
@Injectable()
export class SearchResultComponent implements OnInit {
  UserName: string;
  Lang: string;
  ParamName: string = "Re";
  ProductGroup: string = '0';
  visibleBasket: boolean = false;
  visibleDetails: boolean = false;
  isSubmitted: boolean = false;
  isSubmittedComment: boolean = false;
  Total: Number = 0;
  id: string = '0';
  basket: string = '0';
  public Product: Product[] = [];
  public ProductDetails: Product[] = [];
  public ProductGroupBy: Product[] = [];
  public Vertical:boolean=true;
  CustomerForm: FormGroup;
  UserComment: FormGroup;
  loadAPI: Promise<any>;
  
  OrderByColumn: string = 'PriceSales';
  OrderDirection: string = '1';
  oldCalssActive: string = 'Arzan';
  SY: number=0;
  ProductID: string;
  TotalDiscount:Number;
  RequestResponse:PaymentRequestResponseModel;

  constructor(private activatedRoute: ActivatedRoute, public productservice: ProductService, private configService: ConfigService, public them: them, public router: Router, private formBuilder: FormBuilder) {


  }
  // receiveMessage($event) {
  //   this.Product = $event
  // }
  ngOnInit() {

    this.UserName = '';

    this.Lang = this.productservice.Lang;
    //---------queryParams
    this.activatedRoute.queryParams.subscribe(params => {
      this.visibleDetails = false;
      this.visibleBasket = false;
      var SS = history.state;
      this.ParamName = SS.DATA;
      var History = history.state;

      this.id = History.id;
      this.ProductGroup = params['ProductGroup'];
      this.basket = params['basket'];
      
      var ProductGroupName = params['ProductGroupName'];
      
      //-------------از فرم جزییات وارد این صفحه شده است
      if (this.ProductGroup == undefined) {
        
        this.ProductGroup = History.ProductGroup;
        this.basket = History.basket;
        ProductGroupName = History.ProductGroupName
        let gg=this.them.ScrollY;
        let time=1000;
        if(History !=null && History!=undefined)
        {
          time=2000;
        }
        setTimeout(function() { 
          window.scroll({
          top: gg
          
        }); 
      } , time);
      }
      else{
        this.them.PageNumber='1';
        this.them.ScrollY=0;
      }
      
      //--------------نمایش سبد خرید
      if (this.basket == '1') {
        this.visibleBasket = true;

        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
      }
      //-------افزودن به سبد خرید****************************************************
      if (this.basket == '11') {
        this.onSelectProductOrder(Number(this.id))
        this.visibleBasket = true;
      }
      this.them.ProductGroup = this.ProductGroup;
      this.them.ProductGroupName = ProductGroupName;
      this.Product = [];
      this.productservice.ParamShowSearch = [];

      this.productservice.OnParamShowSearch('', this.them.ProductGroup, null);


      this.productservice.Param1 = History.Param1;
      this.productservice.Param2 = History.Param2;
      this.productservice.Param3 = History.Param3;
      this.productservice.Param4 = History.Param4;
      this.productservice.Param5 = History.Param5;

      this.SearchProduct(null);
      this.productservice.onPaggingSelect(this.them.CompanyID, this.them.ProductGroup);
     
    });
    //---------End queryParams



    //---------------صفحه نتیجه جستجو
    this.productservice.onPageGroupSelect(2);
    //--------------صفحه سبد خرید
    this.productservice.onPageGroupSelect(3);


    this.CustomerForm = this.formBuilder.group({
      CodeMelli: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      Mobile: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      FullName: ['', [Validators.required]],
      Description: [''],
      CustomerID: [null],
      City: ['', [Validators.required]],
      Confirm: [false, [Validators.required]]}, {
        validator: this.ValidConfirm()
    });
    this.UserComment = this.formBuilder.group({
      FullName: [''],
      Description: ['', [Validators.required]],
      ProductID: ['']
    });
    var element = document.getElementById('Arzan');
    element.style.backgroundColor = this.them.ButtonColor;
    element.style.color = this.them.ButtonFontColor     
  }//End ngOnInit
  
  scrollPage(SS:any){
    debugger;
    window.scroll({
      top: SS,
      behavior: 'smooth'
    });
  }  
  public SearchProduct(ProductID: string) {
    this.Product = [];
    if (ProductID == 'param') {
      this.productservice.Paggin = [];
      ProductID = null;
    }
    this.Product = this.productservice.SearchProduct(ProductID, this.them.PageNumber, this.OrderByColumn, this.OrderDirection);

  }

  onSortBy(OrderByColumn: string, OrderDirection: string, myDIV: string) {
    this.OrderByColumn = OrderByColumn;
    this.OrderDirection = OrderDirection;
    this.SearchProduct(null);

    var element = document.getElementById(myDIV);
    element.style.backgroundColor = this.them.ButtonColor;
    element.style.color = this.them.ButtonFontColor;


    if (myDIV != this.oldCalssActive) {
      var elementold = document.getElementById(this.oldCalssActive);
      elementold.style.backgroundColor = 'unset';
      elementold.style.color = 'unset'
    }
    this.oldCalssActive = myDIV;

  }
  onSelectPaggingPrevious(paggingNumber: Number)
  {
    
    paggingNumber = (Number(this.them.PageNumber) + Number(paggingNumber));
    if(paggingNumber<=0)
    {
      paggingNumber=1;
    }

    this.onSelectPagging(paggingNumber);
  }
  onSelectPagging(paggingNumber: Number) {
    
    
    this.them.PageNumber = paggingNumber.toString();
    
    this.SearchProduct(null);

    

  }

  get formControlsCustomer() { return this.CustomerForm.controls; }
  get formControlsUserComment() { return this.UserComment.controls; }
  //------------Add to basket-----------------------------------------------
  //-------افزودن به سبد خرید*********************************************
  onSelectProductOrder(ProductID: Number) {

    this.configService.Fetch_FilterProductID(this.Lang, this.UserName, ProductID.toString()).subscribe(data => {

      
     
      let count = this.productservice.Order.OrderDetails.filter(a => a.ProductID == ProductID).length;

      
      let OrderDetail = {
        ProductID: data[0].ID,
        ProducName: data[0].Name,
        ShoppingCount: Number(count + 1),
        AvalaibleCount: Number(data[0].AvailableCount),
        UnitPrice: data[0].PriceSales,
        TotalPrice: Number(data[0].PriceSales) * Number(count + 1),
        TotalDiscount:Number(data[0].DiscountPrice)* Number(count + 1),
        Total: 0,
        OrderID: null,
        CompanyID: this.them.CompanyID

      }

      //const sum = this.productservice.Order.OrderDetails.reduce((sum, current) => sum + Number(current.UnitPrice) * Number(current.ShoppingCount), 0);

      if (OrderDetail.AvalaibleCount >= OrderDetail.ShoppingCount) {
        this.productservice.Order.OrderDetails.push(OrderDetail);

        this.Total = this.productservice.Order.OrderDetails.reduce((sum, current) => sum + Number(current.UnitPrice) * Number(current.ShoppingCount), 0);
        this.TotalDiscount=this.productservice.Order.OrderDetails.reduce((sum, current) => sum + Number(current.TotalDiscount), 0);
        this.Total=Number(this.Total)-Number(this.TotalDiscount)
        //-------------------------------
        this.visibleBasket = true;
        this.visibleDetails = false;
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
        //----------------------------
        this.them.TotalShopping = this.productservice.Order.OrderDetails.length.toString();
      }
      else {
        if (this.them.Lang == 'fa') {
          Swal.fire({
            title: 'خطا!',
            text: 'موجودی محصول کافی نیست',
            icon: 'error',
            confirmButtonText: 'تایید',
            confirmButtonColor: this.them.ButtonColor,
          })

        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'product inventory is not enough',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.them.ButtonColor,
          })
        }


      }
    });
  }



  AddBasket() {
    this.visibleBasket = false;
    window.scroll({
      top: 350,
      behavior: 'smooth'
    });
    //---------------نمایش همه لیست-----------------------
    if (this.Product.length == 0) {
      this.SearchProduct(null);
    }

  }
  onCloseDetails() {
    
    this.visibleBasket = false;
    window.scroll({
      top: 350,
      behavior: 'smooth'
    });
    //---------------نمایش همه لیست-----------------------
    if (this.Product.length == 0) {
      this.SearchProduct(null);
    }
  }
  DeleteBasket(ProductID: Number) {
    this.productservice.Order.OrderDetails = this.productservice.Order.OrderDetails.filter(a => a.ProductID != ProductID);
    this.Total = this.productservice.Order.OrderDetails.reduce((sum, current) => sum + Number(current.UnitPrice) * Number(current.ShoppingCount), 0);
    this.them.TotalShopping = this.productservice.Order.OrderDetails.length.toString();
  }
  AvalaibleCount() {
    this.productservice.Order.OrderDetails.forEach(a => {
      if (a.AvalaibleCount < a.ShoppingCount) {
        a.ShoppingCount = a.AvalaibleCount;
        if (this.them.Lang == 'fa') {
          Swal.fire({
            title: 'خطا!',
            text: 'موجودی محصول کافی نیست',
            icon: 'error',
            confirmButtonText: 'تایید',
            confirmButtonColor: this.them.ButtonColor,
          })

        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'product inventory is not enough',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.them.ButtonColor,
          })

        }
      }

    });
    this.Total = this.productservice.Order.OrderDetails.reduce((sum, current) => sum + Number(current.UnitPrice) * Number(current.ShoppingCount), 0);
    this.TotalDiscount=this.productservice.Order.OrderDetails.reduce((sum, current) => sum + Number(current.TotalDiscount), 0);
    this.Total=Number(this.Total)-Number(this.TotalDiscount)
  }
  onSearchCustomer(Mobile: string, Email: string,CodeMelli :string) {
    this.configService.Fetch_FilterCustomerGet(this.Lang, '', null, this.them.CompanyID, Mobile, Email, '',CodeMelli).subscribe(data => {

      this.formControlsCustomer.Address.patchValue(data[0].Address);

      this.formControlsCustomer.City.patchValue(data[0].City);

      this.formControlsCustomer.CustomerID.patchValue(data[0].ID);

      this.formControlsCustomer.FullName.patchValue(data[0].FullName);

    })
  }
  SaveOrder() {
    this.isSubmitted = true;


    if (this.CustomerForm.invalid) {
      return;
    }
    else {
      this.them.loading = true;
      this.productservice.Order.Address = this.CustomerForm.controls.Address.value;
      this.productservice.Order.City = this.CustomerForm.controls.City.value;
      this.productservice.Order.CustomerID = this.CustomerForm.controls.CustomerID.value;
      this.productservice.Order.FullName = this.CustomerForm.controls.FullName.value;
      this.productservice.Order.Description = this.CustomerForm.controls.Description.value;
      this.productservice.Order.Email = this.CustomerForm.controls.Email.value;
      this.productservice.Order.Mobile = this.CustomerForm.controls.Mobile.value;
      this.productservice.Order.CodeMelli = this.CustomerForm.controls.CodeMelli.value;
      this.productservice.Order.CompanyID=this.them.CompanyID;
      this.productservice.Order.Total = this.Total;
      this.productservice.Order.TotalDiscount=this.TotalDiscount;
      this.configService.InsertOrder(this.productservice.Order).subscribe(data => {
      this.them.loading = false;
        //------------درگاه نداشته باشد.
        if(data.status==10)
        {
          if (this.Lang == 'fa') {
            Swal.fire({
              title: 'پیغام!',
              text: 'با تشکر ، نظر شما با موفقیت ثبت شد سفارش شما با موفقیت ثبت شد به زودی با شما تماس گرفته خواهد شد',
              icon: 'success',
              confirmButtonText: 'تایید',
              confirmButtonColor: this.them.ButtonColor,
            })
  
          }
          else {
            Swal.fire({
              title: 'Message!',
              text: 'Your order has been successfully registered and you will be contacted soon',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: this.them.ButtonColor,
            })
  
          }
        }//------------اگر خطا در بانک صورت گرفته شده باشد.
        if(data.status==0){
          
           document.location.href=data.location;
          
         
        }
        
        
        //this.router.navigate(['/shopping-basket'], { queryParams: { id: data[0].CustomerID } });
      });



    }
  }
 
  ValidConfirm() {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls["Confirm"];
        
        if (control.errors) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value == false) {
          control.setErrors({ ValidConfirm: true });
        } else {
          control.setErrors(null);
        }
    }
}
  
  SaveUserComment() {
    this.isSubmittedComment = true;
    if (this.UserComment.invalid) {
      return;
    }
    else {
      var params: any = {

        CompanyID: this.them.CompanyID,
        Description: this.UserComment.controls.Description.value,
        FullName: this.UserComment.controls.FullName.value,
        Lang: this.them.Lang,
        ProductID: this.ProductID,
      }
      this.productservice.InsertProductUserComment(params);
      this.UserComment.reset();
      this.isSubmittedComment = false;
      if (this.them.Lang == 'fa') {
        Swal.fire({
          title: 'پیغام!',
          text: 'با تشکر ، نظر شما با موفقیت ثبت شد',
          icon: 'success',
          confirmButtonText: 'تایید',
          confirmButtonColor: this.them.ButtonColor,
        })




      }
      else {
        Swal.fire({
          title: 'Message!',
          text: 'Thank you, your comment was successfully submitted',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: this.them.ButtonColor,
        })

      }
    }
  }
  public onProductDetail(id: Number) {

    this.them.ScrollY=window.scrollY;
    this.router.navigate(['/p/' + id]);

  }
}



