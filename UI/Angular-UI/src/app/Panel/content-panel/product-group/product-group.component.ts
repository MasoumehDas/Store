import { Component, OnInit, QueryList, ViewChildren, Injectable } from '@angular/core';
import { ProductGroup } from '../../../shared/modules/ProductGroup.module';
import { BasicData } from '../../../shared/modules/BasicData.module';
import { them } from '../../../shared/service/themplate.service';
import { panelProcuctGroup } from '../../../shared/service/PanelProductGroup.service';
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
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.css'],
  providers: [them, panelProcuctGroup, DecimalPipe, ConfigService],



  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('900ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ],
})
export class ProductGroupComponent implements OnInit {

  List$: Observable<ProductGroup[]>;
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
  constructor(public service: panelProcuctGroup, private formBuilder: FormBuilder, public them: them, public authService: AuthService, public router: Router, public api: ConfigService) {
    this.List$ = service.List$;
    this.total$ = service.total$;
  }
  //-----------------------------------------------------------
  SearchForm: FormGroup;
  InsertForm: FormGroup;
  UpdateForm: FormGroup;

  SettingsGroupForm: FormGroup;
  isSubmitted = false;
  isSubmittedSettings = false;
  isSubmittedUpdate = false;
  UserName: string;
  Lang: string;
  TitleID: String = '';
  TitleParentID: String = '';

  GroupTypeID: String = '';

  Specification: BasicData[] = [];
  TitleParent: BasicData[] = [];
  Titlethem: BasicData[] = [];
  ProductGroup: ProductGroup[] = [];
  GroupType: BasicData[] = [];
  ProductGroupDetail: ProductGroupDetail[] = [];
  ProductGroupID: Number = null;
  public Message: string;

  //-------------------------------------------------------

  ngOnInit() {
    this.them.selectedRowID = null;
    this.them.selectRow = false;
    this.Specification = [];
    this.SearchForm = this.formBuilder.group({
      Title: [''],
      ParentTitle: ['']

    });

    this.SettingsGroupForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      GroupType: [null, [Validators.required]],
    });

    this.InsertForm = this.formBuilder.group({
      Title: [null, [Validators.required]],
      TitleParent: [null],
      Specification: [null],

    });
    this.UpdateForm = this.formBuilder.group({
      ID: [''],
      Title: [null, [Validators.required]],
      TitleParent: [null],
      Specification: [null],


    });
    this.UserName = this.service.UserName;
    this.Lang = this.service.Lang;

    this.service.Select(this.UserName, this.Lang, null, null, '', '','', true);
    
    //this.service.onProductGroupBaseDataGet(this.Lang);
    //this.service.onSpecificationGet(this.Lang, this.UserName);
    this.service.onProductGroupDetailGroupBy(this.Lang, this.UserName);

    this.dropdownSpecification = {
      singleSelection: false,
      idField: 'GroupTypeName',
      textField: 'GroupTypeName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownTitleParent = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownGroupSettings = {
      singleSelection: true,
      idField: 'GroupType',
      textField: 'GroupTypeName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  get formControls() { return this.InsertForm.controls; }
  get formControlsUpdate() { return this.UpdateForm.controls; }
  get formControlsGroup() { return this.SettingsGroupForm.controls; }
  //********************Dropdown*******************************

  dropdownSpecification: IDropdownSettings = {};
  dropdownTitle: IDropdownSettings = {};
  dropdownTitleParent: IDropdownSettings = {};
  dropdownGroupSettings: IDropdownSettings = {};

  onItemSelectTitle(item: any) {
    this.TitleID = item.ID;
    console.log(item);
  }
  onItemSelectTitleParent(item: any) {
    this.TitleParentID = item.ID;
    console.log(item);
  }

  //dropdownGroupSettings
  onItemSelectGroupType(item: any) {
    this.GroupTypeID = item.GroupType;
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }
  //*****************Select******************************
  questioner() {
    //this.ResetCombo();
    this.service.Select(this.UserName, this.Lang, null, null, this.SearchForm.controls.Title.value, this.SearchForm.controls.ParentTitle.value,null, false);
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

  //***************************New*****************************    
  onInsert() {

    debugger;
    this.isSubmitted = true;

    if (this.InsertForm.invalid) {
      return;
    }
    else {

      var Specification = '<ProductGroupDetails>'
      for (let item of this.ProductGroupDetail) {

        Specification = Specification + '<Details><ID>' + item.ID + '</ID><GroupTypeName>' + item.GroupTypeName + '</GroupTypeName><IsShowSearch>' + item.IsShowSearch + '</IsShowSearch><Sort>' + item.Sort+'</Sort></Details>'
      }
      Specification = Specification + '</ProductGroupDetails>'
      this.ResetCombo();
      var params: any = {
        Lang: this.Lang,
        Title: this.InsertForm.controls.Title.value,
        ParentID: this.TitleParentID,
        Specification: Specification,
        LogUser: this.UserName

      }

      this.service.Insert(params);
    }
  }
  //***********************Edit********************************
  EditOpen(selectedRowID) {
    this.them.selectedRowID=selectedRowID;
    
      this.them.loading = true;
      this.api.Fetch_FilterProductGroupID(this.Lang, this.UserName, this.them.selectedRowID.toString()).subscribe(data => {
        this.ProductGroupID = data[0].ID;
        this.formControlsUpdate.ID.patchValue(data[0].ID);

        this.formControlsUpdate.Title.patchValue(data[0].Title);
        //------------------------combo--------------------------------------
       
        this.ProductGroup = this.service.ProductGroup.filter(a => a.ID == data[0].ParentID)

        this.TitleParentID = data[0].ParentID;



        this.api.Fetch_FilterProductGroupDetailGet(this.Lang, this.UserName, null, this.them.selectedRowID.toString(),null).subscribe(Data => {
          this.ProductGroupDetail = Data;
          this.them.modal_open_edit = true;
          this.them.loading = false;
        });

        

      });
    

  }

  //*******************************Update*****************************************
  onUpdate() {


    this.isSubmittedUpdate = true;

    if (this.UpdateForm.invalid) {
      return;
    }
    else {

      var Specification = '<ProductGroupDetails>'
      for (let item of this.ProductGroupDetail) {

        Specification = Specification + '<Details><ID>' + item.ID + '</ID><GroupTypeName>' + item.GroupTypeName + '</GroupTypeName><IsShowSearch>' + item.IsShowSearch + '</IsShowSearch><Sort>' + item.Sort +'</Sort></Details>'
      }
      Specification = Specification + '</ProductGroupDetails>'
      this.ResetCombo();
      var params: any = {
        ID: this.UpdateForm.controls.ID.value,
        Lang: this.Lang,
        Title: this.UpdateForm.controls.Title.value,
        ParentID: this.TitleParentID,
        Specification: Specification,
        LogUser: this.UserName

      }

      this.service.Update(params);
      this.them.onResetPage(this.UpdateForm);
      this.them.modal_open_edit = false;
      this.them.selectedRowID = null;
      this.them.selectRow = false;

    }
  }
  
  
  //------------------------ResetCombo-------------------------
  ResetCombo() {

    if (this.ProductGroup != null && this.ProductGroup.length > 0) {

      this.TitleParentID = this.ProductGroup[0].ID.toString();
    }
    else {
      this.TitleParentID = '';
    }


  }
  item_Specification: string;
  onFindSpecification(Param: string='') {


    document.getElementById("SpecificationFild").style.display = "block";
    document.getElementById("SpecificationFildInsert").style.display = "block";

    if (Param == null || Param == '') {
      Param = this.UpdateForm.controls.Specification.value;
      
    }
    this.service.ProductGroupDetail_Search = this.service.ProductGroupDetail_ALL.filter(a => a.GroupTypeName.includes(Param));



  }
  onFindSpecificationInsert() {
    this.onFindSpecification(this.InsertForm.controls.Specification.value);
  }
  ID: number = 0;
  onSelectSpecification(ID: number) {
    this.ID = Number(this.ID - 1);
    document.getElementById("SpecificationFild").style.display = "none";
    document.getElementById("SpecificationFildInsert").style.display = "none";
    if (this.ProductGroupDetail.filter(a => a.GroupTypeName == this.service.ProductGroupDetail_Search.find(a => a.ID == ID).GroupTypeName).length == 0) {
      this.ProductGroupDetail.push({
        ProductGroupID: this.ProductGroupID,
        ID: this.ID,
        Grouptype: '',
        GroupTypeName: this.service.ProductGroupDetail_Search.find(a => a.ID == ID).GroupTypeName,
        IsShowSearch: true,
        Sort:null,

      })
    }

  }
  onDeleteSpecification(ID: number) {

    this.ProductGroupDetail = this.ProductGroupDetail.filter(a => a.ID != ID);
  }
  onAddNew(Param: string = '') {
    this.ID = Number(this.ID - 1);
    document.getElementById("SpecificationFild").style.display = "block";
    document.getElementById("SpecificationFildInsert").style.display = "block";

    if (Param == null || Param == '') {
      Param = this.UpdateForm.controls.Specification.value;
    }
    if (Param != null && Param != '' && Param!= undefined) {
      this.ProductGroupDetail.push({
        ProductGroupID: this.ProductGroupID,
        ID: this.ID,
        Grouptype: 'New',
        GroupTypeName: Param,
        IsShowSearch: true,
        Sort: null,
      })

    }

  }
  onAddNewInsert() {
    debugger;
    this.onAddNew(this.InsertForm.controls.Specification.value);

  }
}






