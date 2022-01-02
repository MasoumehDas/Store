import { Component, OnInit, QueryList, ViewChildren, Injectable, EventEmitter } from '@angular/core';

import { Order } from '../../../shared/modules/Order.module';
import { BasicData } from '../../../shared/modules/BasicData.module';
import { them } from '../../../shared/service/themplate.service';
import { NuLLValue } from '../../../shared/service/NullValue.sevice';
import { panelPurchase } from '../../../shared/service/panelPurchase.service';
import { AuthService } from './../../../shared/auth.service';
import { ConfigService } from '../../../shared/service/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, interval } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '../../../shared/service/sortable.directive';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbDateStruct, NgbCalendar, NgbDatepickerI18n, NgbCalendarPersian, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';//https://www.npmjs.com/package/ng-multiselect-dropdown
import { Purchase } from '../../../shared/modules/Purchase.module';

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
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  providers: [

    { provide: localStorage.getItem('language') == 'fa' ? NgbCalendar : NuLLValue, useClass: localStorage.getItem('language') == 'fa' ? NgbCalendarPersian : NuLLValue },

    { provide: localStorage.getItem('language') == 'fa' ? NgbDatepickerI18n : NuLLValue, useClass: localStorage.getItem('language') == 'fa' ? NgbDatepickerI18nPersian : NuLLValue }
  ],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('900ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ],
})


export class PurchaseComponent implements OnInit {

  List$: Observable<Purchase[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  constructor(public service: panelPurchase, private formBuilder: FormBuilder, public them: them, public authService: AuthService, public router: Router, public api: ConfigService, private parserFormatter: NgbDateParserFormatter) {
    this.List$ = service.List$;
    this.total$ = service.total$;
  }
  //-----------------------------------------------------------
  SearchForm: FormGroup;
 
  isSubmitted = false;
  
  UserName: string;
  Lang: string;
  StatusID: String = '';
  
  Status: BasicData[] = [];
  public Message: string;
  

  //-------------------------------------------------------

  ngOnInit() {
    this.them.selectedRowID = null;
    this.them.selectRow = false;
   
    this.SearchForm = this.formBuilder.group({
      OrderID: ['']
      , FullName: ['']
      , Status: ['']
      , FromDate: ['']
      , ToDate: ['']
      
    });
    
    this.UserName = this.service.UserName;
    this.Lang = this.service.Lang;

    this.service.Select(this.Lang,this.UserName,null,this.them.CompanyID, null, '','','','' );
    this.service.onPurchaseStatusGet(this.Lang);

   

    this.dropdownSettingsStatus = {
      singleSelection: true,
      idField: 'CodeINT',
      textField: 'Title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    
  }
  get formControls() { return this.SearchForm.controls; }
 
  //********************Dropdown*******************************

  dropdownSettingsStatus: IDropdownSettings = {};
 

  onItemSelectStatus(item: any) {
    this.StatusID = item.CodeINT;
    console.log(item);
  }
  
  onSelectAll(items: any) {
    console.log(items);
  }
  //*****************Select******************************
  questioner() {
    
    this.service.Select(this.Lang,this.UserName,
       this.SearchForm.controls.OrderID.value,
        this.them.CompanyID, 
        null,
       this.parserFormatter.format(this.SearchForm.controls.FromDate.value),
       this.parserFormatter.format(this.SearchForm.controls.ToDate.value),
       this.SearchForm.controls.FullName.value, this.StatusID.toString());
  }


  onFindSpecification(ID: string) {
    
    document.getElementById("PurchaseStatus-"+ID).style.display = "block";
    
    
  }
  onSelectSpecification(CodeINT:Number,ID: string) {
    
    document.getElementById("PurchaseStatus-"+ID).style.display = "none";
    var dd= this.service.PurchaseStatus.find(a=>a.CodeINT==CodeINT);
    var params: any = {
      Lang: this.Lang,
      UserName: this.UserName,
      ID: ID,
      StatusID:CodeINT,
      Description_Admin:''
    }
    this.service.Update(params);

  }
}






