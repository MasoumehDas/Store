import { Component, OnInit, QueryList, ViewChildren, Injectable } from '@angular/core';
import { ProductGroup } from '../../../shared/modules/ProductGroup.module';
import { BasicData } from '../../../shared/modules/BasicData.module';
import { them } from '../../../shared/service/themplate.service';
import { panelProcuctGroupDetail } from '../../../shared/service/PanelProductGroupDetail.service';
import { AuthService } from './../../../shared/auth.service';
import { ConfigService } from '../../../shared/service/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '../../../shared/service/sortable.directive';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';//https://www.npmjs.com/package/ng-multiselect-dropdown
import { ProductGroupDetail } from '../../../shared/modules/ProductGroupDetail.module';
import { getValueInRange } from '@ng-bootstrap/ng-bootstrap/util/util';
import { DebugHelper } from 'protractor/built/debugger';

const WEEKDAYS_SHORT = ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) { return WEEKDAYS_SHORT[weekday - 1]; }
  getMonthShortName(month: number) { return MONTHS[month - 1]; }
  getMonthFullName(month: number) { return MONTHS[month - 1]; }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`; }
}

@Component({
  selector: 'app-product-group-detail',
  templateUrl: './product-group-detail.component.html',
  styleUrls: ['./product-group-detail.component.css'],
  providers: [them, panelProcuctGroupDetail, DecimalPipe, ConfigService]
})
export class ProductGroupDetailComponent implements OnInit {
  
  constructor(public service: panelProcuctGroupDetail, private formBuilder: FormBuilder, public them: them, public authService: AuthService, public router: Router, public api: ConfigService) {
    
  }
  UserName: string;
  Lang: string;
  searchTerm:string='';
  ProductGroupTitle:string='';
  ngOnInit() {
    this.UserName = this.service.UserName;
    this.Lang = this.service.Lang;
    this.service.SelectCompanyProductGroup();
    

  }
  onSelectCompanyProductGroup(ID : Number,Title:string){

    this.ProductGroupTitle=Title;
    this.service.onGroupTypeGet(this.UserName, this.Lang, ID.toPrecision());
    //this.service.Specification.length
    this.service.Specification=[];
  }
  onSelectProductGroupDetail(GroupType:string,GroupTypeName:string)
  {
    
    this.service.ProductSpecificationSelect(this.Lang,this.UserName , GroupType,GroupTypeName);
  }
  //***********************EDIT********************************
  Update(ID :Number,Title:String){
    var params: any = {
      ID: ID,
      Title: Title,
      UserName:this.UserName,
      Lang:this.Lang
    
    }
    this.service.Update(params);
    
  }
  //***********************Delete******************************

  ConfirmDeleteResponse(response: boolean) {
    this.them.modal_open_delete = false;

    if (response) {
      this.service.Delete(this.UserName, this.them.selectedRowID.toString());
      this.them.selectedRowID = null;
      this.them.selectRow = false;
      

    }
  }
  onSearch(){
   this.service.Specification=this.service.Specification_ALL.filter(a=>a.Title.includes(this.searchTerm));
  }
}
