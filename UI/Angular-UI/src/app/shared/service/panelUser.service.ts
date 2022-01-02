import { Injectable, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { User } from '../modules/User';
import { Basic } from '../modules/BasicData.module';
import { Company } from '../../shared/modules/Company.module';
import { UserRole } from '../../shared/modules/UserRole.module';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { them } from './themplate.service';
import { SortDirection } from './sortable.directive';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';
interface SearchResult {
  List: User[];


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

function sort(List: User[], column: string, direction: string): User[] {
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
export class panelUserProfile {

  //===========================================================================
  public UserProfile: User[] = [];
  public Gender: Basic[] = [];
  public UserRole: UserRole[] = [];
  public Company: Company;
  public Companies: Company[] = [];

  public UserName: string = this.authService.getUserName();
 
  public UserID: string = this.authService.getUserID();
  public Lang: string = localStorage.getItem('language');
  //===========================================================================
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _List$ = new BehaviorSubject<User[]>([]);//this.Select('', '', '', "", '', true)
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
    let List = sort(this.UserProfile, sortColumn, sortDirection);

    //2. filter
    if (searchTerm != null && searchTerm != "") {

      List = List.filter(a =>
        (a.UserName === null ? false : a.UserName.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.Name === null ? false : a.Name.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.Family === null ? false : a.Family.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.Mobile === null ? false : a.Mobile.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.Email === null ? false : a.Email.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.NationalCode === null ? false : a.NationalCode.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        || (a.CompanyName === null ? false : a.CompanyName.toString().toLowerCase().includes(searchTerm.toLowerCase()))

      );

    }

    const total = List.length;

    // 3. paginate
    List = List.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ List, total });
  }
  //*******************************************************************************************************************
  Select(Lang: string, UserName: string, UserID: string, Name: string, Family: string, CompanyID: string, RoleID: string, Mobile: string, Email: string, NationalCode: string): User[] {

    this.configService.Fetch_FilterUserProfileGet(Lang, UserName, UserID, Name, Family, CompanyID, RoleID, Mobile, null, Email, NationalCode).subscribe(data => {

      this.UserProfile = data;
      this._List$ = new BehaviorSubject<User[]>(data);

      this._search();
      
      this.page = this.them.Page,
        this.pageSize = this.them.PageSize,
        console.log('UserProfile');
      console.log(this.UserProfile);
      console.log('UserProfile_List$');
      console.log(this._List$);
      return this.UserProfile;

    });

    return this.UserProfile;

  }
  successful: any;
  Message: any;

  Delete(UserName: string, ID: string) {
    let result: any;
    this.configService.DeleteUserProfile_ID(ID, UserName).subscribe(data => {
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
  Insert(params: any) {


    let result: any;
    this.configService.InserUserProfile(params).subscribe(data => {

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
    this.configService.UpdateUserProfile(params).subscribe(data => {

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
  InserSettings(Params: any) {
    let result: any;

    this.configService.InserUserRole(Params).subscribe(data => {

      this.onUserRoleGet(this.Lang);

      this.them.SeupAlert(null, 'alert-Info');
      this.them.ShowAlert('alert-Info');

    });
  }
  /**********************Data***Combo**********************************/
  onGenderGet(Lang: string) {
    this.configService.FetchBaseData_GroupType(Lang, this.UserName, 'Gender', '').subscribe(data => {
      this.Gender = data;
      console.log('Gender');
      console.log(this.Gender);

    });

  }
  onUserRoleGet(Lang: string) {
    this.configService.FetchUserRole_Filter(Lang, this.UserID).subscribe(data => {
      this.UserRole = data;
      console.log(this.UserRole);

    });
  }
  /**********************Data***Combo**********************************/
  CompanySelectID(Lang: string, UserName: string, CompanyID: string) {
    this.configService.FetchCompany_FilterID(Lang, UserName, CompanyID).subscribe(data => {
      this.Company = data;
      console.log(this.Company);
      return this.Company;
    });

  }

}

