import { Injectable, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageMenu } from '../../shared/modules/PageMenu.module';
import { DecimalPipe } from '@angular/common';
import { them } from './themplate.service';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';


@Injectable({ providedIn: 'root' })
export class panelPageMenu {

  //===========================================================================
  public PageMenu: PageMenu[] = [];
  

  public UserName: string = this.authService.getUserID();
  public Lang: string = localStorage.getItem('language');
  //===========================================================================
  

  constructor(private pipe: DecimalPipe, private configService: ConfigService, public authService: AuthService, private translate: TranslateService, public them: them) {

  }
  //*******************************************************************************************************************
  Select(Lang: string, UserName: string, CompanyID: string) {

    this.configService.Fetch_FilterPageMenuGet(Lang, UserName, CompanyID).subscribe(data => {
      this.PageMenu = data;
   
    });

  }
  Update(params: any) {


    let result: any;
    this.configService.UpdatePageMenu(params).subscribe(data => {

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

