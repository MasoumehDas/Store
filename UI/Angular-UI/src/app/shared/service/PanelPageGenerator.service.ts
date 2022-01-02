import { Injectable, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TranslateService} from '@ngx-translate/core';

import { PageGenerator } from '../modules/PageGenerator.module';
import { BasicData } from '../modules/BasicData.module';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { them } from './themplate.service';
import { SortDirection } from './sortable.directive';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';
interface SearchResult {
    List: PageGenerator[] ;


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

function sort(List: PageGenerator[], column: string, direction: string): PageGenerator[] {
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
export class panelPageGenerator {
   
    //===========================================================================
    public PageGenerator: PageGenerator[] = [];
    public PageGeneratorStatus: BasicData[] ;
    public Country: BasicData[];   
    public PageGeneratorGroup: BasicData[];
    
    public UserName: string = this.authService.getUserName();
    public Lang: string = localStorage.getItem('language');
    //===========================================================================
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _List$ = new BehaviorSubject<PageGenerator[]>([]);//this.Select('', '', '', "", '', true)
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
        let List = sort(this.PageGenerator, sortColumn, sortDirection);

         //2. filter
        if (searchTerm != null && searchTerm != "")
        {

          
          
            List = List.filter(a => 
                   (a.Active === null ? false :a.Active.toString().toLowerCase().includes(searchTerm.toLowerCase()))
              || (a.PageLocation === null ? false : a.PageLocation.toString().toLowerCase().includes(searchTerm.toLowerCase()))
              || (a.PageTitle === null ? false : a.PageTitle.toString().toLowerCase().includes(searchTerm.toLowerCase()))
              || (a.PageUrl === null ? false : a.PageUrl.toString().toLowerCase().includes(searchTerm.toLowerCase()))
              || (a.Sort === null ? false : a.Sort.toString().toLowerCase().includes(searchTerm.toLowerCase()))
               
                );
            
        }
        
        const total = List.length;

        // 3. paginate
        List = List.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        
        return of({ List, total });
    }
    //*******************************************************************************************************************
  Select(Lang: string, UserName: string, CompanyID: string, ID: string, PageContent: string, PageLocationID: string): PageGenerator[] {
    this.configService.Fetch_FilterPageGeneratorGet(Lang, UserName, ID, CompanyID, PageContent, PageLocationID,null).subscribe(data => {
            
            this.PageGenerator = data;
            this._List$ = new BehaviorSubject<any>(this.PageGenerator);
          
            this.page=this.them.Page;
            this.pageSize=this.them.PageSize;

            
            return this.PageGenerator;

        });

        return this.PageGenerator;

    }  
    

    
    Update(params: any) {


        let result: any;
        this.configService.UpdatePageGenerator(params).subscribe(data => {

            result = data;
            console.log('Update : ' + result);

            if (result === '0') {
                
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
  Delete(UserName: string, ID: string) {
    let result: any;
    this.configService.DeletePageGeneratorID(ID, UserName,this.Lang).subscribe(data => {
      result = data;
      console.log(result);
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
    //onPageGeneratorStatusGet(Lang: string) {
    //    this.configService.FetchBaseData_GroupType(Lang,this.UserName, 'PageGeneratorStatus','').subscribe(data => {
    //        this.PageGeneratorStatus = data.filter(a=>a.CodeINT!=0);
    //        console.log(this.PageGeneratorStatus);

    //    });
 
    //}
    
    
    
}

