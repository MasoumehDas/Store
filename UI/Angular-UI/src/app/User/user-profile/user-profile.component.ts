
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, PipeTransform, QueryList, ViewChildren, Injectable } from '@angular/core';

import { User } from '../../shared/modules/User';
import { Basic } from '../../shared/modules/BasicData.module';
import { Company } from '../../shared/modules/Company.module';
import { UserRole } from '../../shared/modules/UserRole.module';
import { them } from '../../shared/service/themplate.service';
import { panelUserProfile } from '../../shared/service/panelUser.service';
import { AuthService } from '../../shared/auth.service';
import { ConfigService } from '../../shared/service/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, Subject, merge, BehaviorSubject } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '../../shared/service/sortable.directive';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';//https://www.npmjs.com/package/ng-multiselect-dropdown

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
  selector: 'app-user-Profile',
  templateUrl: './user-Profile.component.html',
  styleUrls: ['./user-Profile.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('900ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ],
})

export class UserProfileComponent implements OnInit {
  //*******************Grid Setting*********************
  List$: Observable<User[]>;
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
  constructor(public service: panelUserProfile,
    private formBuilder: FormBuilder,
    public them: them,
    public authService: AuthService,
    public router: Router,
    public api: ConfigService,
    public activatedRoute: ActivatedRoute) {

    this.List$ = service.List$;
    this.total$ = service.total$;
  }
  //-----------------------------------------------------------
  SearchForm: FormGroup;
  InsertForm: FormGroup;
  UpdateForm: FormGroup;
  SettingsGroupForm: FormGroup;
  isSubmitted = false;
  isSubmittedUpdate = false;
  isSubmittedSettings = false;
  disable = false;
  fieldTextType: boolean;
  UserName: string;
  Lang: string;
  GenderID: String;
  UserRolesID: String = '';
  CompanyID: String = '';
  Companies: Company[] = [];
  Company: Company[] = [];
  UserRoles: UserRole[] = [];
  Gender: Basic[] = [];

  public Message: string;

  //-------------------------------------------------------

  ngOnInit() {
    this.them.selectedRowID = null;
    this.them.selectRow = false;

    this.UserName = this.service.UserName;
    this.Lang = this.service.Lang;
    debugger;
    this.activatedRoute.queryParams.subscribe(params => {
      this.CompanyID = params['id'];
    });
    //this.service.CompanySelectID(this.Lang, this.UserName, this.CompanyID==null?'':this.CompanyID.toString());
    this.service.Select(this.Lang, null, this.service.UserID, '', '', this.CompanyID == null ? '' : this.CompanyID.toString(), '', '', '', '');
    this.service.onUserRoleGet(this.Lang);
    this.service.onGenderGet(this.Lang);
    this.CompanySelect(this.Lang, this.UserName);

    this.SearchForm = this.formBuilder.group({
      UserName: [''],
      Name: [''],
      Family: [''],
      Mobile: [''],
      Email: [''],
      NationalCode: [''],
      UserRoles: [null],
      Company: [null],
    });

    this.SettingsGroupForm = this.formBuilder.group({
      RoleName: ['', [Validators.required]]

    });

    this.InsertForm = this.formBuilder.group({
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      Name: ['', [Validators.required]],
      Family: ['', [Validators.required]],
      Mobile: [''],
      Email: [''],
      Tell: [''],
      NationalCode: [''],
      UserRoles: [null, [Validators.required]],
      Gender: [null, [Validators.required]],
      Company: [null, [Validators.required]],
      Active: [true]

    });
    this.UpdateForm = this.formBuilder.group({
      ID: [''],
      UserName: [null, [Validators.required]],
      Password: ['', [Validators.required]],
      Name: ['', [Validators.required]],
      Family: ['', [Validators.required]],
      Mobile: [''],
      Email: [''],
      Tell: [''],
      NationalCode: [''],
      UserRoles: [null, [Validators.required]],
      Gender: [null, [Validators.required]],
      Company: [null, [Validators.required]],
      Active: [true]
    });

    this.dropdownUserRoleSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'RoleName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownGenderSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownCompaniesSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  get formControlsInsert() { return this.InsertForm.controls; }
  get formControlsUpdate() { return this.UpdateForm.controls; }
  get formControlsGroup() { return this.SettingsGroupForm.controls; }
  //********************Dropdown*******************************



  dropdownUserRoleSettings: IDropdownSettings = {};
  dropdownGenderSettings: IDropdownSettings = {};
  dropdownCompaniesSettings: IDropdownSettings = {};

  onItemSelectUserRoles(item: any) {
    this.UserRolesID = item.ID;
    console.log(item);
  }
  onItemSelecGender(item: any) {
    this.GenderID = item.ID;
    console.log(item);
  }
  onItemSelecCompanies(item: any) {
    this.CompanyID = item.ID;
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  //*****************Select******************************
  questioner() {
    debugger;
    this.ResetCombo();
    this.service.Select(this.Lang,
      this.SearchForm.controls.UserName.value,
      this.service.UserID,
      this.SearchForm.controls.Name.value,
      this.SearchForm.controls.Family.value,
      this.CompanyID.toString(),
      this.UserRolesID.toString(),
      this.SearchForm.controls.Mobile.value,
      this.SearchForm.controls.Email.value,
      this.SearchForm.controls.NationalCode.value
    );
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


    this.isSubmitted = true;

    if (this.InsertForm.invalid) {
      return;
    }
    else {

      var params: any = {
        Lang: this.Lang,
        Name: this.InsertForm.controls.Name.value,
        Family: this.InsertForm.controls.Family.value,
        Mobile: this.InsertForm.controls.Mobile.value,
        Tell: this.InsertForm.controls.Tell.value,
        NationalCode: this.InsertForm.controls.NationalCode.value,
        UserName: this.InsertForm.controls.UserName.value,
        Password: this.InsertForm.controls.Password.value,
        Email: this.InsertForm.controls.Email.value,
        Active: this.InsertForm.controls.Active.value,
        RoleID: this.UserRolesID,
        Gender: this.GenderID,
        CompanyID: this.CompanyID,
        LogUser: this.UserName

      }


      this.service.Insert(params);
    }
  }
  //***********************Edit********************************
  EditOpen(selectedRowID) {

    if (this.them.selectRow == false) {
      this.them.SeupAlert(null, 'alert-warning');
      this.them.ShowAlert('alert-warning');

    }
    else {
      this.api.FetchUserProfile_FilterID(this.Lang, null, this.them.selectedRowID.toString()).subscribe(data => {

        this.formControlsUpdate.ID.patchValue(data[0].UserID);
        this.formControlsUpdate.Name.patchValue(data[0].Name);
        this.formControlsUpdate.Family.patchValue(data[0].Family);
        this.formControlsUpdate.Mobile.patchValue(data[0].Mobile);
        this.formControlsUpdate.UserName.patchValue(data[0].UserName);
        this.formControlsUpdate.Password.patchValue(data[0].Password);
        this.formControlsUpdate.Tell.patchValue(data[0].Tell);
        this.formControlsUpdate.NationalCode.patchValue(data[0].NationalCode);
        this.formControlsUpdate.Email.patchValue(data[0].Email);
        this.UserRoles = this.service.UserRole.filter(a => a.ID == data[0].RoleID)
        this.UserRolesID = data[0].RoleID == null ? '' : data[0].RoleID.toString();

        this.Gender = this.service.Gender.filter(a => a.ID == data[0].Gender)
        this.GenderID = data[0].Gender == null ? '' : data[0].Gender.toString();
        debugger;
        this.Company = this.Companies.filter(a => a.ID == data[0].CompanyID)
        this.CompanyID = data[0].CompanyID == null ? '' : data[0].CompanyID.toString();
        this.disable = data[0].UserName != null && data[0].UserName != '' ? true : false;
        this.them.modal_open_edit = true;
      });
    }

  }

  //*******************************Update**********************
  onUpdate() {

    this.isSubmittedUpdate = true;

    if (this.UpdateForm.invalid) {
      return;
    }
    else {

      var params: any = {
        Lang: this.Lang,
        ID: this.UpdateForm.controls.ID.value,
        Name: this.UpdateForm.controls.Name.value,
        Family: this.UpdateForm.controls.Family.value,
        Mobile: this.UpdateForm.controls.Mobile.value,
        Tell: this.UpdateForm.controls.Tell.value,
        Email: this.UpdateForm.controls.Email.value,
        NationalCode: this.UpdateForm.controls.NationalCode.value,
        UserName: this.UpdateForm.controls.UserName.value,
        Password: this.UpdateForm.controls.Password.value,
        Active: this.UpdateForm.controls.Active.value,
        RoleID: this.UserRolesID,
        Gender: this.GenderID,
        CompanyID: this.CompanyID,
        LogUser: this.UserName

      }

      this.service.Update(params);
      this.UserRoles = [];
      this.Gender = [];
      this.them.modal_open_edit = false;
      this.them.selectedRowID = null;
      this.them.selectRow = false;

    }
  }
  //---------------------------------------------------------------
  onInsertSettings() {

    console.log(this.SettingsGroupForm.value);
    this.isSubmittedSettings = true;

    if (this.SettingsGroupForm.invalid) {
      return;
    }
    else {
      var Params: any = {
        RoleName: this.SettingsGroupForm.controls['RoleName'].value,
        logUser: this.UserName,
        Lang: this.Lang
      }
      this.service.InserSettings(Params);

      this.isSubmittedSettings = false;


    }
  }
  CompanySelect(Lang: string, UserName: string) {
    this.api.FetchCompany_Filter(Lang, UserName).subscribe(data => {
      this.Companies = data;
      this.Company = this.Companies.filter(a => a.ID.toString() == (this.CompanyID == null ? '' : this.CompanyID.toString()));
      return this.Companies;
    });

  }
  //------------------------ResetCombo-------------------------
  ResetCombo() {

    if (this.UserRoles != null && this.UserRoles.length > 0) {

      this.UserRolesID = this.UserRoles[0].ID.toString();
    }
    else {
      this.UserRolesID = '';
    }

    if (this.Company != null && this.Company.length > 0) {

      this.CompanyID = this.Company[0].ID.toString();
    }
    else {
      this.CompanyID = '';
    }

  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}

