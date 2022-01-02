import { Injectable, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TranslateService} from '@ngx-translate/core';
import { Purchase } from '../modules/Purchase.module';
import { Basic } from '../modules/BasicData.module';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { them } from './themplate.service';
import { SortDirection } from './sortable.directive';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';
interface SearchResult {
    List: Purchase[] ;


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

function sort(List: Purchase[], column: string, direction: string): Purchase[] {
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
export class panelPurchase {
   
    //===========================================================================
    public Purchase: Purchase[] = [];
    public PurchaseStatus: Basic[] ;
    public Country: Basic[];   
    public PurchaseGroup: Basic[];
    
    public UserName: string = this.authService.getUserName();
    public Lang: string = localStorage.getItem('language');
    //===========================================================================
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _List$ = new BehaviorSubject<Purchase[]>([]);//this.Select('', '', '', "", '', true)
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
        let List = sort(this.Purchase, sortColumn, sortDirection);

         //2. filter
        if (searchTerm != null && searchTerm != "")
        {
           
            List = List.filter(a => 
                   (a.City === null ? false :a.City.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.DateShamsi === null ? false :a.DateShamsi.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.Email === null ? false :a.Email.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.FullName === null ? false :a.FullName.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.ProducName === null ? false :a.ProducName.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.Mobile === null ? false : a.Mobile.toString().toLowerCase().includes(searchTerm.toLowerCase())) 
                || (a.StatusName === null ? false : a.StatusName.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                || (a.Address === null ? false : a.Address.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                );
            
        }
        
        const total = List.length;

        // 3. paginate
        List = List.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        
        return of({ List, total });
    }
    //*******************************************************************************************************************
    Select(Lang: string, UserName: string, ID: string, CompanyID: string, CustomerID: string, FromDate: string, ToDate: string,  FullName: string, Status: string): Purchase[] {
        this.configService.Fetch_FilterPurchaseGet(Lang, UserName,ID, CompanyID, CustomerID, FromDate,ToDate,FullName,Status).subscribe(data => {
            
            this.Purchase = data;
            
            this.Purchase = this.Purchase.reduce(function (r, a) {
                r[a.ID.toString()] = r[a.ID.toString()] || [];
                r[a.ID.toString()].push(a);
                return r;
              }, Object.create(null));
          
              this.Purchase= Object.keys(this.Purchase).map((key) => this.Purchase[key]);

            this._List$ = new BehaviorSubject<any>(this.Purchase);
            
           
            
            this.page=this.them.Page;
            this.pageSize=this.them.PageSize;

            
            return this.Purchase;

        });

        return this.Purchase;

    }  
    

    
    Update(params: any) {


        let result: any;
        this.configService.UpdatePurchase(params).subscribe(data => {

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
    
    /**********************Data***Combo**********************************/
    onPurchaseStatusGet(Lang: string) {
        this.configService.FetchBaseData_GroupType(Lang,this.UserName, 'PurchaseStatus','').subscribe(data => {
            this.PurchaseStatus = data.filter(a=>a.CodeINT!=0);
            console.log(this.PurchaseStatus);

        });
 
    }
    
    
    
}

