import { Injectable, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TranslateService} from '@ngx-translate/core';
import { Company } from '../modules/Company.module';
import { Basic } from '../modules/BasicData.module';
import { ProductGroup } from '../modules/ProductGroup.module';
import { CompanyProductGroup } from '../../shared/modules/CompanyProductGroup.module';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { them } from './themplate.service';
import { SortDirection } from './sortable.directive';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';
interface SearchResult {
    List: Company[] ;


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

function sort(List: Company[], column: string, direction: string): Company[] {
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
export class panelCompany {
   
    //===========================================================================
    public ProductGroup: ProductGroup[] = [];
    public CompanyProductGroup: CompanyProductGroup[] = [];
    public company: Company[] = [];
    public City: Basic[] ;
    public Country: Basic[];   
    public CompanyGroup: Basic[];
    public GroupType: Basic[];
    public UserName: string = this.authService.getUserName();
    public Lang: string = localStorage.getItem('language');
    //===========================================================================
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _List$ = new BehaviorSubject<Company[]>([]);//this.Select('', '', '', "", '', true)
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
        let List = sort(this.company, sortColumn, sortDirection);

         //2. filter
        if (searchTerm != null && searchTerm != "")
        {
            
            List = List.filter(a => 
                   (a.Name === null ? false :a.Name.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.CountryTitle === null ? false :a.CountryTitle.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.CityName === null ? false :a.CityName.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.Tell === null ? false :a.Tell.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.WatsUpNumber === null ? false :a.WatsUpNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.Email === null ? false : a.Email.toString().toLowerCase().includes(searchTerm.toLowerCase())) 
                || (a.CompanyGroup_Title === null ? false : a.CompanyGroup_Title.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                );
            
        }
        
        const total = List.length;

        // 3. paginate
        List = List.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        
        return of({ List, total });
    }
    //*******************************************************************************************************************
  Select(Lang: string, CompanyName: string, UserName: string, CountryID_BasicData: string, CityID_BasicData: string, isLoad: boolean, CompanyGroupID_BaseData: string, WesiteUrl:string): Company[] {
    this.configService.FetchCompany_FilterGet(Lang, CompanyName, UserName, CountryID_BasicData, CityID_BasicData, CompanyGroupID_BaseData, WesiteUrl).subscribe(data => {
            
            this.company = data;
            
            this._List$ = new BehaviorSubject<Company[]>(data);
            
            //this._search();
            
            this.page=this.them.Page,
            this.pageSize=this.them.PageSize,

            console.log('company');
            console.log(this.company);
            console.log('company_List$ ' + isLoad);
            console.log(this._List$);
            return this.company;

        });

        return this.company;

    }  
    

    Delete(UserName: string, ID: string) {
        let result: any;
        this.configService.DeleteCompany_ID(ID, UserName,this.Lang).subscribe(data => {
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
        this.configService.InsertCompany(params).subscribe(data => {
            
            result = data;
            console.log('Insert : ' + result);
            
            if (result === '0')
            {
                document.getElementById('btn-Search').click();
                this.them.SeupAlert(null, 'alert-Info');
                this.them.ShowAlert('alert-Info');
            }
            else {
                if (this.Lang == 'fa')
                {
                    this.them.AlertLis.Title = 'خطا';
                    this.them.AlertLis.Body = result;
                    this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
                }
                else
                {
                    this.them.AlertLis.Title = 'Error';
                    this.them.AlertLis.Body = result;
                    this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
                }
               
                this.them.ShowAlert('alert-warning');
            }
           

        });
    }
    Update(params: any,isliload:boolean=true) {


        let result: any;
        this.configService.UpdateCompany(params).subscribe(data => {

            result = data;
            console.log('Update : ' + result);

            if (result === '0') {
                if(isliload)
                {
                    document.getElementById('btn-Search').click();
                }
                
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
    InserSettings(Name: string, UserName: string, Group: string, Lang: string)
    {
        let result: any;
        this.configService.InsertSettings(Name, UserName, Group, Lang).subscribe(data => {
            if (Group == 'City')
            {
                this.onCityGet(Lang);
            }
            if (Group == 'Country') {
                this.onCountryGet(Lang);
            }
            if (Group == 'CompanyGroup') {
                this.onCompanyGroupGet(Lang);
            }
            this.them.SeupAlert(null, 'alert-Info');
            this.them.ShowAlert('alert-Info');
           
        });
    }
    /**********************Data***Combo**********************************/
    onCityGet(Lang: string) {
        this.configService.FetchBaseData_GroupType(Lang,this.UserName, 'City','').subscribe(data => {
            this.City = data;
            console.log(this.City);

        });
 
    }
    onCountryGet(Lang: string) {
        this.configService.FetchBaseData_GroupType(Lang, this.UserName, 'Country','').subscribe(data => {
            this.Country = data;
            console.log(this.Country);

        });
    }
    onCompanyGroupGet(Lang: string) {
        this.configService.FetchBaseData_GroupType(Lang, this.UserName, 'CompanyGroup','').subscribe(data => {
            this.CompanyGroup = data;
            console.log(this.Country);

        });
    }
    onGroupTypeGet(Lang: string) {
        this.configService.FetchBaseData_GroupSelect(Lang,this.UserName,'').subscribe(data => {
            this.GroupType = data;
            console.log(this.Country);

        });
    }
  GetTelegramUserChatID(CompanyID: string) {
    let result: any;
    this.them.loading = true;
    this.configService.GetTelegramUserChatID(CompanyID).subscribe(data => {
      this.them.loading = false;
      result = data;
      Swal.fire('پیغام', result);
    });
  }
  GetTelegramGroupChatID(CompanyID: string) {
    let result: any;
    this.them.loading = true;
    this.configService.GetTelegramGroupChatID(CompanyID).subscribe(data => {
      this.them.loading = false;
      result = data;
      Swal.fire('پیغام', result);
    });
  }
  GetProductGroup(){
    this.configService.Fetch_FilterProductGroupGet(this.Lang, this.UserName, null, null, null, null, null).subscribe(data => {
        this.ProductGroup = data;
      });
  
  }
  GetCompanyProductGroup(){
    this.configService.Fetch_FilterCompanyProductGroupGet(this.them.CompanyID, this.Lang)
    .subscribe(data => {
      this.CompanyProductGroup = data;
    });
  }
}

