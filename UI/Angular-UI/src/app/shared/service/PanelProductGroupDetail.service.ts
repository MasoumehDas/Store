import { Injectable, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ProductGroup } from '../modules/ProductGroup.module';

import { BasicData } from '../modules/BasicData.module';
import { DecimalPipe } from '@angular/common';

import { them } from './themplate.service';

import { ConfigService } from './api.service';
import { AuthService } from '../auth.service';
import { ProductGroupDetail } from '../modules/ProductGroupDetail.module';
import { CompanyProductGroup } from '../modules/CompanyProductGroup.module';






@Injectable({ providedIn: 'root' })
export class panelProcuctGroupDetail {

  //===========================================================================
 
 
  public Specification: BasicData[];
  public Specification_ALL: BasicData[];
  
  
  public ProductGroupDetail: ProductGroupDetail[];
  
  public CompanyProductGroup:CompanyProductGroup[]=[];

  public UserName: string = this.authService.getUserName();
  public Lang: string = localStorage.getItem('language');
  //===========================================================================
  

  constructor(private pipe: DecimalPipe, private configService: ConfigService, public authService: AuthService, private translate: TranslateService, public them: them) {


    
  }

  

  //*******************************************************************************************************************
  
  
  SelectCompanyProductGroup(){
      this.configService.Fetch_FilterCompanyProductGroupGet(this.them.CompanyID,this.Lang).subscribe(data => {
        this.CompanyProductGroup=data;
      })
  }
  Delete(UserName: string, ID: string) {
    let result: any;
    this.configService.DeleteProductSpecification(this.Lang,ID, UserName).subscribe(data => {
      result = data;
      if (result === '0') {
        this.Specification=this.Specification_ALL.filter(a=>a.ID.toString() !=ID);
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
    this.configService.UpdateProductSpecification(params).subscribe(data => {

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
  
  
  onGroupTypeGet(UserName: string, Lang: string, ProductGroupID: string) {
    this.configService.Fetch_FilterProductGroupDetailGet(Lang, this.UserName, null, ProductGroupID,this.them.CompanyID).subscribe(data => {
      this.ProductGroupDetail = data;
      
     
    });
  }
  ProductSpecificationSelect(Lang: string, UserName: string,GroupType:String,GroupTypeName:String) {
    this.configService.FetchProductSpecificationSelect(Lang,UserName , GroupType.toString(),GroupTypeName.toString(),this.them.CompanyID).subscribe(data => {
      this.Specification = data;
      this.Specification_ALL=data;
     
    });

  }
}

