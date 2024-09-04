import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../../shared/service/product.service';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/service/api.service';
import { Product } from '../../shared/modules/Product.module';
import { them } from '../../shared/service/themplate.service';

@Component({
  selector: 'app-product-list-large',
  templateUrl: './product-list-large.component.html',
  styleUrls: ['./product-list-large.component.css'],
  providers: [ProductService, ConfigService]
})
export class ProductListLargeComponent implements OnInit {

  constructor(public productService: ProductService, public configService: ConfigService, public them: them, public router: Router) { }
  @Input() products: Product[];
  @Input() IsHomePage: boolean = false;
  @Input() type: string = '';
  page: string = '';
  @Input() ComparisonProduct: Product[] = [];
  ngOnInit() {

  }
  public onProductDetail(id: string, type: string) :string{

    var url = this.productService.RouterProductDetail(id, type, this.IsHomePage)
    return url;


  }
  //------------Add to basket-----------------------------------------------
  onSelectProductOrder(ProductID: Number, productGroup: Number, ProductGroupName: string, basket: Number) {

    if (this.page != 'home') {
      this.router.navigate(['/basket'],

        {
          state: {
            DATA: this.productService.ParamNameString(),
            Param1: this.productService.Param1,
            Param2: this.productService.Param2,
            Param3: this.productService.Param3,
            Param4: this.productService.Param4,
            Param5: this.productService.Param5,
            id: ProductID,
            basket: basket,
            ProductGroup: productGroup,
            ProductGroupName: ProductGroupName,

          },

        });

    }
    else {
      let gg = this.them.ScrollY;
      setTimeout(function () {
        window.scroll({
          top: gg

        });
      }, 1000);
      window.history.back();
    }
  }
  onSelectCompar() {
    this.ComparisonProduct = this.products.filter(a => a.Comparison == true);
    let ss = 800;
    if (this.page != 'home') {
      ss = 450;
    }
    window.scroll({
      top: ss,
      behavior: 'smooth'
    });
  }
}
