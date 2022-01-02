import { Injectable, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../modules/User';

import { Menu } from '../../shared/modules/UserAccess.module';
import { DenyMenu } from '../../shared/modules/UserAccess.module';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { them } from './themplate.service';
import { UserRole } from '../../shared/modules/UserRole.module';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';
@Injectable({ providedIn: 'root' })
export class panelUserAccess {
  public UserProfile: User[] = [];
  public Menu: Menu[] = [];
  public DenyMenu: DenyMenu[] = [];
  public AllowMenu: Menu[] = [];
  public UserRole: UserRole[] = [];
  public UserName: string = this.authService.getUserID();
  public RoleID: string = this.authService.getRoleID();
  public Lang: string = localStorage.getItem('language');
  constructor(private pipe: DecimalPipe, private configService: ConfigService, public authService: AuthService, private translate: TranslateService, public them: them) {
  }
  onHeight() {

    //----------------------Height-------------------------------------------
    var elmnt = document.getElementById('Deny');
    var Height = elmnt.clientHeight;
    document.getElementById('Deny').style.height = Number((this.DenyMenu.length * 48) + 100) + "px";

    var elmnt_Allow = document.getElementById('Allow');
    var Height = elmnt_Allow.clientHeight;
    document.getElementById('Allow').style.height = Number((this.AllowMenu.length * 48) + 100) + "px";
  }
  onUserPofile_DefaultCompanyGet(Lang: string, UserName: string, CodeUser: string, Name: string, Family: string, ResturantID: string, RoleID: string, Mobile: string, TokenID: string, Email: string) {
    this.configService.Fetch_FilterUserProfileGet(Lang, UserName, CodeUser, Name, Family, ResturantID, RoleID, Mobile, TokenID, Email,'').subscribe(data => {
      this.UserProfile = data;

    });


  }
  onUserRoleGet(Lang: string) {
    this.configService.FetchUserRole_Filter(Lang, this.UserName).subscribe(data => {
      this.UserRole = data;
      console.log(this.UserRole);

    });
  }
  onSelectMenu() {
    this.configService.Fetch_FilterUserMenuGet(this.Lang, this.UserName, '', 'true', 'true').subscribe(data => {
      this.Menu = data;

    });
  }
  onSelectMenuAccess(RoleID: string, ControlID: string) {
    this.configService.Fetch_FilterUserAcessMenuGet(this.Lang, this.UserName, RoleID, '', ControlID, 'true', null).subscribe(data => {
      this.AllowMenu = data;
      this.onHeight();
    });
  }
  onSelectMenuNotAccess(RoleID: string, ControlID: string) {
    this.configService.Fetch_FilterUserNotAcessMenuGet(this.Lang, this.UserName, RoleID, '', ControlID, 'true', null).subscribe(data => {
      this.DenyMenu = data;
      this.onHeight();
    });
  }
  Delete(UserName: string, ID: string) {
    let result: any;
    this.configService.DeleteUserAcess_ID(ID, UserName).subscribe(data => {
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

    });
  }
  Insert(params: any) {


    let result: any;
    this.configService.InserUserAcess(params).subscribe(data => {

      result = data;
      console.log('Insert : ' + result);

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


    });
  }
}
