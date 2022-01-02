import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductGroup } from '../modules/ProductGroup.module';
import { BasicData } from '../modules/BasicData.module';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { them } from './themplate.service';
import { SortDirection } from './sortable.directive';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';
import { ProductGroupDetail } from '../modules/ProductGroupDetail.module';

interface SearchResult {
  List: ProductGroup[];
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

function sort(List: ProductGroup[], column: string, direction: string): ProductGroup[] {
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
export class panelProcuctGroup {

  //===========================================================================
  public ProductGroup: ProductGroup[] = [];
  public ProductGroupParent: ProductGroup[] = [];
  public Specification: BasicData[];
  public ProductGroupGroup: BasicData[];
  public TitleParent: BasicData[] = [];
  public Title: BasicData[] = [];
  public ProductGroupDetail: ProductGroupDetail[];
  public ProductGroupDetails: ProductGroupDetail[];

  public ProductGroupDetail_ALL: ProductGroupDetail[]=[];
  public ProductGroupDetail_Search: ProductGroupDetail[]=[];
  a
  public UserName: string = this.authService.getUserName();
  public Lang: string = localStorage.getItem('language');
  //===========================================================================
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _List$ = new BehaviorSubject<ProductGroup[]>([]);//this.Select('', '', '', "", '', true)
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
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
    let List = sort(this.ProductGroup, sortColumn, sortDirection);
    
    //2. filter
    if (searchTerm != null && searchTerm != "") {
     
      List = List.filter(a =>
        (a.ID === null ? false : a.ID.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.parent_Title === null ? false : a.parent_Title.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.Title === null ? false : a.Title.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        
      );

    }

    const total = List.length;

    // 3. paginate
    List = List.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ List, total });
  }
  //*******************************************************************************************************************
  Select(UserName: string, Lang: string, ID: string, ParentID: string, Title: string, ParentTitle: string, IsLastChid: string,isLoad:Boolean): ProductGroup[] {
    this.configService.Fetch_FilterProductGroupGet(Lang, UserName, ID, ParentID, Title, ParentTitle, IsLastChid).subscribe(data => {

      this.ProductGroup = data;
      this.ProductGroupParent = this.ProductGroup.filter(a => a.IsLastChid == false);
      this._List$ = new BehaviorSubject<ProductGroup[]>(data);

      //this._search();
     
      this.page = this.them.Page,
        this.pageSize = this.them.PageSize,

      console.log('ProductGroup');
      console.log(this.ProductGroup);
      console.log('ProductGroup_List$ ' + isLoad);
      console.log(this._List$);
      return this.ProductGroup;

    });

    return this.ProductGroup;

  }
  

  Delete(UserName: string, ID: string) {
    let result: any;
    this.configService.DeleteProductGroupID(ID, UserName, this.Lang).subscribe(data => {
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
    this.configService.InsertProductGroup(params).subscribe(data => {

      result = data;
      console.log('Insert : ' + result);

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
    this.configService.UpdateProductGroup(params).subscribe(data => {

      result = data;
      console.log('Update : ' + result);

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
  // InserSettings(Name: string, UserName: string, Group: string, Lang: string) {
  //   let result: any;
  //   this.configService.InsertSettings(Name, UserName, Group, Lang).subscribe(data => {
  //     if (Group == this.them.ProductGroup) {
  //       this.onSpecificationGet(Lang, UserName);
  //     }
  //     //if (Group == 'ProductGroup') {
  //     //  this.onCountryGet(Lang);
  //     //}
  //     if (Group == 'ProductGroup') {
  //       this.onProductGroupBaseDataGet(Lang);
  //     }
  //     this.them.SeupAlert(null, 'alert-Info');
  //     this.them.ShowAlert('alert-Info');

  //   });
  // }
  /**********************Data***Combo**********************************/
  // onSpecificationGet(Lang: string, UserName: string) {
  //   this.configService.FetchSelectProductSpecificationGroup(Lang, UserName,'').subscribe(data => {
  //     this.Specification = data;
  //   });

  // }
 
  // onProductGroupBaseDataGet(Lang: string) {
  //   this.configService.FetchProductSpecificationSelect(Lang, this.UserName, 'ProductGroup',null,null).subscribe(data => {
  //       this.TitleParent = data;
       
  //   });
  // }
  
  onGroupTypeGet(UserName: string, Lang: string, ProductGroupID: string) {
    this.configService.Fetch_FilterProductGroupDetailGet(Lang, this.UserName, null, ProductGroupID,null).subscribe(data => {
      this.ProductGroupDetail = data;
     
    });
  }
  onProductGroupDetailGroupBy(Lang: string, UserName: string) {
    this.configService.Fetch_SelectProductGroupDetailGroupBy(Lang, UserName).subscribe(data => {
      this.ProductGroupDetail_ALL = data;
      this.ProductGroupDetail_Search = data;
    });

  }
}

