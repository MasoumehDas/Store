import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Product } from '../modules/Product.module';
import { BasicData } from '../modules/BasicData.module';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { them } from './themplate.service';
import { SortDirection } from './sortable.directive';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';
import { ParamShowSearch } from '../../shared/modules/ParamShowSearch.module';
import { ProductImage } from '../../shared/modules/ProductImage.module';
import { ProductDetailSpecification,PeropertyItems } from '../modules/Product.module';
import { CompanyProductGroup } from '../modules/CompanyProductGroup.module';
import { CompanyTransportation } from '../modules/CompanyTransportation.module';
interface detail_ {
  ParamSearch: string;
  ParamName: string;
  Specification: string;
  Specification_new:string;
  ID: number;
  listDeatils: BasicData[];
  PeropertyItems:PeropertyItems[];
  

}

interface SearchResult {
  List: Product[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(List: Product[], column: string, direction: string): Product[] {
  if (direction === '') {
    return List;
  } else {
    return [...List].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}


@Injectable({ providedIn: 'root' })
export class panelProcuct {

  //===========================================================================
  public Product: Product[] = [];
  public Specification: BasicData[];
  public ProductGroupDetail: BasicData[];

  public details_themp: detail_[] = [];
  public ProductImage: ProductImage[] = [];
  public ParamShowSearch: ParamShowSearch[];
  public CompanyProductGroup: CompanyProductGroup[] = [];
  public ProductDetailSpecification: ProductDetailSpecification[];
  public UserName: string = this.authService.getUserName();
  public Lang: string = localStorage.getItem('language');
  public CompanyTransportation:CompanyTransportation[];
  //===========================================================================
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _List$ = new BehaviorSubject<Product[]>([]);//this.Select('', '', '', "", '', true)
  private _total$ = new BehaviorSubject<number>(0);
  private page_last: number=null;
  private _state: State = {
    page: this.page_last!=null?this.page_last:1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private configService: ConfigService, public authService: AuthService, private translate: TranslateService, public them: them) {


    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {

      this._List$.next(result.List);
      this._total$.next(result.total);
    });

    //this._search$.next();
  }

  public get List$() { return this._List$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let List = sort(this.Product, sortColumn, sortDirection);

    //2. filter
    if (searchTerm != null && searchTerm != "") {
      
      List = List.filter(a =>

        (a.AvailableCount === null ? false : a.AvailableCount.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.BarCode === null ? false : a.BarCode.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.CompanyID === null ? false : a.CompanyID.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.Currency === null ? false : a.Currency.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.FromDateSpecialSales === null ? false : a.FromDateSpecialSales.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.FromDateSpecialSales_Mila === null ? false : a.FromDateSpecialSales_Mila.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.ID === null ? false : a.ID.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.ImageUrl === null ? false : a.ImageUrl.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.Name === null ? false : a.Name.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.ParentID === null ? false : a.ParentID.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.PriceBuy === null ? false : a.PriceBuy.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.PriceSales === null ? false : a.PriceSales.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );

    }

    const total = List.length;

    // 3. paginate
    List = List.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ List, total });
  }
  //*******************************************************************************************************************
  Select(UserName: string, Lang: string, ID: string, CompanyID: string, ProductGroupID: string, BarCode: string, Name: string,
    IsAvailable:string,Acive:string,IsViewTelegram:string,IsViewInstagram:string,IsSendInstagram:string,IsSendTelegram:string,IsSpecialSales:string
    , isLoad: Boolean,Specification:string): Product[] {
    this.configService.Fetch_FilterProductGet(Lang, UserName, ID, CompanyID, ProductGroupID, BarCode, Name
      ,IsAvailable,Acive,IsViewTelegram,IsViewInstagram,IsSendInstagram,IsSendTelegram,IsSpecialSales,Specification).subscribe(data => {
      this.Product=[];
      this.Product = data;

      this._List$ = new BehaviorSubject<Product[]>(data);
      this.page = this.them.Page;
      this.pageSize = this.them.PageSize;
      return this.Product;

    });

    return this.Product;

  }


  Delete(UserName: string, ID: string) {
    let result: any;
    this.configService.DeleteProductID(ID, UserName, this.Lang).subscribe(data => {
      result = data;
      if (result === '0') {
        document.getElementById('btn-Search').click();
        this.them.SeupAlert(null, 'alert-Info');
        this.them.ShowAlert('alert-Info');
      }
      else {

        if (this.Lang == 'fa') {
          this.them.AlertLis.Title = 'خطا';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }
        else {
          this.them.AlertLis.Title = 'Error';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }

        this.them.ShowAlert('alert-warning');
      }

    });
  }
  Insert(params: any) {


    let result: any;
    this.configService.InsertProduct(params).subscribe(data => {

      result = data;
      console.log('Insert : ' + result);
      
      this.them.Page=this._state.page;
      if (result === '0') {
        document.getElementById('btn-Search').click();
        
        this.them.SeupAlert(null, 'alert-Info');
        this.them.ShowAlert('alert-Info');
      }
      else {
        if (this.Lang == 'fa') {
          this.them.AlertLis.Title = 'خطا';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }
        else {
          this.them.AlertLis.Title = 'Error';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }

        this.them.ShowAlert('alert-warning');
      }


    });
  }
  Update(params: any) {


    let result: any;
    this.configService.UpdateProduct(params).subscribe(data => {

      result = data;
      console.log('Update : ' + result);

      if (result === '0') {
        // document.getElementById('btn-Search').click();
        this.them.SeupAlert(null, 'alert-Info');
        this.them.ShowAlert('alert-Info');
      }
      else {

        if (this.Lang == 'fa') {
          this.them.AlertLis.Title = 'خطا';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }
        else {
          this.them.AlertLis.Title = 'Error';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }

        this.them.ShowAlert('alert-warning');
      }


    });
  }
  // InserSettings(Name: string, UserName: string, Group: string, Lang: string) {
  //     let result: any;
  //     this.configService.InsertSettings(Name, UserName, Group, Lang).subscribe(data => {
  //         if (Group ==  this.them.ProductGroup) {
  //             this.onSpecificationGet(Lang);
  //         }
  //         //if (Group == 'Product') {
  //         //  this.onCountryGet(Lang);
  //         //}
  //         //if (Group == 'Product') {
  //         //  this.onProductGroupGet(Lang);
  //         //}
  //         this.them.SeupAlert(null, 'alert-Info');
  //         this.them.ShowAlert('alert-Info');

  //     });
  // }
  /**********************Data***Combo**********************************/
  onSpecificationGet(Lang: string, ProductGroupID) {
    this.configService.FetchProductSpecificationSelect(Lang, this.UserName, ProductGroupID, '',this.them.CompanyID).subscribe(data => {
      
      this.Specification = data;


    });

  }


  onProductDetailGet(UserName: string, Lang: string, ProductGroupID: string): detail_[] {
    this.configService.FetchProductDatail(Lang, this.UserName, ProductGroupID).subscribe(data => {


      this.ParamShowSearch = data;

      this.details_themp=[];
      for (let item of this.ParamShowSearch) {

        this.configService.FetchProductSpecificationSelect(Lang, this.UserName, ProductGroupID, item.GroupTypeName,this.them.CompanyID).subscribe(data => {
          

          this.ProductGroupDetail = data;

          
          var b: detail_ = {
            listDeatils: data,
            ParamSearch: item.GroupTypeName,
            ParamName: item.GroupTypeName,
            ID: null,
            Specification: '',
            PeropertyItems:[],
            Specification_new: '',

          }
          
          this.details_themp.push(b);


        });

      }//End For


      return this.details_themp;
    });
    return this.details_themp;
  }
  //*******************ProductImage**********************************
  onProductImages(Lang: string, UserName: string, ProductID: string) {
    this.configService.Fetch_FilterProductImageGet(Lang, UserName, ProductID, '').subscribe(data => {
      this.ProductImage = data;
    });
  }
  //   onProductDetailSpecificationGet(Lang: string, UserName: string, ProductID: string) {
  //     this.configService.Fetch_FilterProductDetail_SpecificationGet(Lang, UserName, ProductID)
  //       .subscribe(data => {
  //         this.ProductDetailSpecification = data;
  //       });
  //   }

  InsertImage(params: any, FoodID: string) {
    let result: any;
   
    this.configService.InsertProductImage(params).subscribe(data => {

      result = data;
      console.log('InsertImage : ' + result);

      if (result === '0') {

        this.them.SeupAlert(null, 'alert-Info');
        this.them.ShowAlert('alert-Info');
      }
      else {

        if (this.Lang.toLowerCase() == 'fa') {
          this.them.AlertLis.Title = 'خطا';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }
        else {
          this.them.AlertLis.Title = 'Error';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }

        this.them.ShowAlert('alert-warning');
      }
      this.onProductImages(this.Lang, this.UserName, FoodID);

    });

  }

  DeleteImage(UserName: string, ID: string, FoodID: string) {
    let result: any;
    this.configService.DeleteProductImageID(ID, UserName, this.Lang).subscribe(data => {
      result = data;
      console.log(result);
      if (result === '0') {

        this.them.SeupAlert(null, 'alert-Info');
        this.them.ShowAlert('alert-Info');
      }
      else {
        if (this.Lang.toLowerCase() == 'fa') {
          this.them.AlertLis.Title = 'خطا';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }
        else {
          this.them.AlertLis.Title = 'Error';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }

        this.them.ShowAlert('alert-warning');
      }
      this.onProductImages(this.Lang, this.UserName, FoodID);
    });
  }

  SendToTelegram(CompanyID: string) {
    let result: any;
    this.them.loading = true;
    this.configService.SendTelegram(CompanyID).subscribe(data => {
      this.them.loading = false;
      result = data;
      console.log(result);
      if (result === '0') {

        this.them.SeupAlert(null, 'alert-Info');
        this.them.ShowAlert('alert-Info');
        document.getElementById('btn-Search').click();
      }
      else {
        if (this.Lang.toLowerCase() == 'fa') {
          this.them.AlertLis.Title = 'خطا';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }
        else {
          this.them.AlertLis.Title = 'Error';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }

        this.them.ShowAlert('alert-warning');
      }

    });
  }

  SendToInstagram(CompanyID: string) {
    let result: any;
    this.them.loading = true;
    this.configService.SendInstagram(CompanyID).subscribe(data => {
      this.them.loading = false;
      result = data;
      console.log(result);
      if (result === '0') {

        this.them.SeupAlert(null, 'alert-Info');
        this.them.ShowAlert('alert-Info');
        document.getElementById('btn-Search').click();
      }
      else {
        if (this.Lang.toLowerCase() == 'fa') {
          this.them.AlertLis.Title = 'خطا';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }
        else {
          this.them.AlertLis.Title = 'Error';
          this.them.AlertLis.Body = result;
          this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
        }

        this.them.ShowAlert('alert-warning');
      }

    });
  }
  SelectCompanyTransportationGet(){
    this.configService.Fetch_FilterCompanyTransportationGet(this.Lang, this.UserName, this.them.CompanyID,null).subscribe(data => {

      this.CompanyTransportation = data;
      
    });
  }
 
}

