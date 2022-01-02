import { Injectable, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CompanySettings } from '../../shared/modules/CompanySettings.module';
import { DecimalPipe } from '@angular/common';
import { them } from './themplate.service';
import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';


@Injectable({ providedIn: 'root' })
export class panelCompanySettings {

  //===========================================================================
  public CompanySettings: CompanySettings[] = [];
  public MaxPage: Number=0;

  public UserName: string = this.authService.getUserID();
  public Lang: string = localStorage.getItem('language');
  //===========================================================================
  

  constructor(private pipe: DecimalPipe, private configService: ConfigService, public authService: AuthService, private translate: TranslateService, public them: them) {

  }
  //*******************************************************************************************************************
  Select(Lang: string, UserName: string, CompanyID: string,category:string) {

    this.configService.FetchCompanySetting(Lang, UserName, CompanyID, category).subscribe(data => {
     
      this.CompanySettings = data;
      this.MaxPage = data[0].MaxPageShow;


      
    });

  }
  Insert(params: any) {


    let result: any;
    this.configService.InsertCompanySetting(params).subscribe(data => {

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

