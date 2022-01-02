import { Component, OnInit, QueryList, ViewChildren, Injectable } from '@angular/core';
import { Company } from '../../../shared/modules/Company.module';
import { Basic } from '../../../shared/modules/BasicData.module';
import { them } from '../../../shared/service/themplate.service';
import { panelCompany } from '../../../shared/service/panelCompany.service';
import { AuthService } from './../../../shared/auth.service';
import { ConfigService } from '../../../shared/service/api.service';


import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { NgbdSortableHeader, SortEvent } from '../../../shared/service/sortable.directive';
import Swal from 'sweetalert2'
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
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
  selector: 'app-company-index',
  templateUrl: './company-index.component.html',
  styleUrls: ['./company-index.component.css'],
  providers: [them, panelCompany, DecimalPipe, ConfigService],



  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('900ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ],
})
export class CompanyIndexComponent implements OnInit {
  //*****************Help*******************************
  //http://www.garethrepton.com/TypeScript-equivalents-for-DotNet-Linq-functions/   TypeScript common linq command equivalents
  //this.InsertForm.controls['CityID_Basic'].setValidators([Validators.required]);
  //https://www.npmjs.com/package/ng-multiselect-dropdown 'ng-multiselect-dropdown';
  //this.loginForm.controls.Captcha.value
  //*******************Grid Setting*********************
  List$: Observable<Company[]>;
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
  constructor(public service: panelCompany, private formBuilder: FormBuilder, public them: them, public authService: AuthService, public router: Router, public api: ConfigService) {
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
  CityID: String = '';
  CountryID: String = '';
  CompanyGroupID: String = '';
  GroupTypeID: String = '';
  City: Basic[] = [];
  Country: Basic[] = [];
  CompanyGroup: Basic[] = [];
  GroupType: Basic[] = [];
  public Message: string;
  ImageInsertLogo: string = "../../../../assets/image/NoImage.png";
  ImageUpdateLogo: string = "../../../../assets/image/NoImage.png";

  ImageInsertBack: string = "../../../../assets/image/NoImage.png";
  ImageUpdateBack: string = "../../../../assets/image/NoImage.png";
  configUrlBasicImage: string = this.them.configUrlBasicImage

  //-------------------------------------------------------

  ngOnInit() {
    this.them.selectedRowID = null;
    this.them.selectRow = false;
    this.SearchForm = this.formBuilder.group({
      CompanyName: [''],
      City: [null],
      Country: [null],
      CompanyGroup: [null],
    });

    this.SettingsGroupForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      GroupType: [null, [Validators.required]],
    });

    this.InsertForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Tell: ['', [Validators.required]],
      ContractName: ['', [Validators.required]],
      Fax: [''],
      WatsUpNumber: [''],
      Mobile: [''],
      Email: [''],
      WebsiteUrl: ['', [Validators.required]],
      TelegramUrl: [''],
      InstagramUrl: [''],
      Description: [''],
      Address: [''],
      Active: true,
      City: [null, [Validators.required]],
      Country: [null, [Validators.required]],
      CompanyGroup: [null, [Validators.required]],
      LogoUrl: [''],
      BackgroudUrl: [''],
      TelegramChanalName: [''],
      InstagramUserName: [''],
      InstagramPassword: [''],
      TelegramUserName: [''],
      TelegramBotToken: [''],

    });
    this.UpdateForm = this.formBuilder.group({
      ID: [''],
      Name: ['', [Validators.required]],
      Tell: ['', [Validators.required]],
      ContractName: ['', [Validators.required]],
      Fax: [''],
      WatsUpNumber: [''],
      Mobile: [''],
      Email: [''],
      WebsiteUrl: ['', [Validators.required]],
      TelegramUrl: [''],
      InstagramUrl: [''],
      Description: [''],
      Address: [''],
      Active: true,
      City: [null, [Validators.required]],
      Country: [null, [Validators.required]],
      CompanyGroup: [null, [Validators.required]],
      LogoUrl: [''],
      BackgroudUrl: [''],
      TelegramChanalName: [''],
      InstagramUserName: [''],
      InstagramPassword: [''],
      TelegramUserName: [''],
      TelegramBotToken: [''],
      NamadTag: [''],
      LicenseTag1: [''],
      LicenseTag2: [''],
      VideoDefault_ImageUrl: [''],
      SocialNetworks1_LogUrl: [''],
      SocialNetworks2_LogUrl: [''],
      SocialNetworks1_Url: [''],
      SocialNetworks2_Url: [''],
      HeaderColor: [''],
      ButtonColor: [''],
      HeaderFontColor: [''],
      ButtonFontColor: [''],
      PriceColor: [''],
      PriceFontColor: [''],

    });
    this.UserName = this.service.UserName;
    this.Lang = this.service.Lang;

    this.service.Select(this.Lang, '', this.UserName, '', '', false, '', '');
    this.service.onCityGet(this.Lang);

    this.service.onCountryGet(this.Lang);
    this.service.onCompanyGroupGet(this.Lang);
    this.service.onGroupTypeGet(this.Lang);

    this.dropdownSettings = {
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

  dropdownSettings: IDropdownSettings = {};
  dropdownGroupSettings: IDropdownSettings = {};

  onItemSelectCity(item: any) {
    this.CityID = item.ID;
    console.log(item);
  }
  onItemSelectCountry(item: any) {
    this.CountryID = item.ID;
    console.log(item);
  }
  onItemSelectCompanyGroup(item: any) {
    this.CompanyGroupID = item.ID;
    console.log(item);
  }

  onItemSelectGroupType(item: any) {
    this.GroupTypeID = item.GroupType;
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }
  //*****************Select******************************
  questioner() {
    this.ResetCombo();
    this.service.Select(this.Lang, this.SearchForm.controls.CompanyName.value, this.UserName, this.CountryID.toString(), this.CityID.toString(), false, this.CompanyGroupID.toString(), '');
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
  //*******************************************************
  public EventSelect(selectedRowID) {

    if (this.them.selectRow == false) {
      this.them.SeupAlert(null, 'alert-warning');
      this.them.ShowAlert('alert-warning');

    }

    else {
      this.router.navigate(['/Panel/company-event'], { queryParams: { id: this.them.selectedRowID.toString() } });

    }

  }
  public UserSelect(selectedRowID) {

    if (this.them.selectRow == false) {
      this.them.SeupAlert(null, 'alert-warning');
      this.them.ShowAlert('alert-warning');

    }

    else {
      this.router.navigate(['/Panel/user-profile'], { queryParams: { id: this.them.selectedRowID.toString() } });

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

        Name: this.InsertForm.controls.Name.value,
        Tell: this.InsertForm.controls.Tell.value,
        Fax: this.InsertForm.controls.Fax.value,
        WatsUpNumber: this.InsertForm.controls.WatsUpNumber.value,
        SMSNumber: '',
        Email: this.InsertForm.controls.Email.value,
        WebsiteUrl: this.InsertForm.controls.WebsiteUrl.value,
        TelegramUrl: this.InsertForm.controls.TelegramUrl.value,
        InstagramUrl: this.InsertForm.controls.InstagramUrl.value,
        Mobile: this.InsertForm.controls.Mobile.value,
        Active: this.InsertForm.controls.Active.value,
        LogUser: this.UserName,
        CountryID_Basic: this.CountryID,
        CityID_Basic: this.CityID,
        CompanyGroupID_BaseData: this.CompanyGroupID,
        ContractName: this.InsertForm.controls.ContractName.value,
        Description: this.InsertForm.controls.Description.value,
        Address: this.InsertForm.controls.Address.value,
        LogoUrl: this.InsertForm.controls.LogoUrl.value,
        BackgroudUrl: this.InsertForm.controls.BackgroudUrl.value,
        TelegramChanalName: this.InsertForm.controls.TelegramChanalName.value,
        InstagramUserName: this.InsertForm.controls.InstagramUserName.value,
        InstagramPassword: this.InsertForm.controls.InstagramPassword.value,
        TelegramUserName: this.InsertForm.controls.TelegramUserName.value,
        TelegramBotToken: this.InsertForm.controls.TelegramBotToken.value,
        NamadTag: this.UpdateForm.controls.NamadTag.value,
        LicenseTag1: this.UpdateForm.controls.LicenseTag1.value,
        LicenseTag2: this.UpdateForm.controls.LicenseTag2.value,
        VideoDefault_ImageUrl: this.UpdateForm.controls.VideoDefault_ImageUrl.value,
        SocialNetworks1_LogUrl: this.UpdateForm.controls.SocialNetworks1_LogUrl.value,
        SocialNetworks2_LogUrl: this.UpdateForm.controls.SocialNetworks2_LogUrl.value,
        SocialNetworks1_Url: this.UpdateForm.controls.SocialNetworks1_Url.value,
        SocialNetworks2_Url: this.UpdateForm.controls.SocialNetworks2_Url.value,
        HeaderColor: this.UpdateForm.controls.HeaderColor.value,
        HeaderFontColor: this.UpdateForm.controls.HeaderFontColor.value,
        ButtonColor: this.UpdateForm.controls.ButtonColor.value,
        ButtonFontColor: this.UpdateForm.controls.ButtonFontColor.value,
        PriceColor: this.UpdateForm.controls.PriceColor.value,
        PriceFontColor: this.UpdateForm.controls.PriceFontColor.value,

      }

      this.service.Insert(params);
      this.ImageInsertLogo = "../../../../assets/image/NoImage.png";
      this.ImageInsertBack = "../../../../assets/image/NoImage.png";
    }
  }
  //***********************Edit********************************
  EditOpen(selectedRowID) {

    this.them.selectedRowID=selectedRowID;
    
      this.api.FetchCompany_FilterID(this.Lang, this.UserName, this.them.selectedRowID.toString()).subscribe(data => {
        this.formControlsUpdate.ID.patchValue(data[0].ID);
        this.formControlsUpdate.Name.patchValue(data[0].Name);
        this.formControlsUpdate.Tell.patchValue(data[0].Tell);
        this.formControlsUpdate.ContractName.patchValue(data[0].ContractName);
        this.formControlsUpdate.Fax.patchValue(data[0].Fax);
        this.formControlsUpdate.WatsUpNumber.patchValue(data[0].WatsUpNumber);
        this.formControlsUpdate.Mobile.patchValue(data[0].Mobile);

        this.formControlsUpdate.Email.patchValue(data[0].Email);
        this.formControlsUpdate.WebsiteUrl.patchValue(data[0].WebsiteUrl);
        this.formControlsUpdate.TelegramUrl.patchValue(data[0].TelegramUrl);
        this.formControlsUpdate.InstagramUrl.patchValue(data[0].InstagramUrl);
        this.formControlsUpdate.Description.patchValue(data[0].Description);
        this.formControlsUpdate.Address.patchValue(data[0].Address);
        this.formControlsUpdate.LogoUrl.patchValue(data[0].LogoUrl);
        this.formControlsUpdate.BackgroudUrl.patchValue(data[0].BackgroundUrl);
        this.ImageUpdateLogo = this.configUrlBasicImage + data[0].LogoUrl;
        this.ImageUpdateBack = this.configUrlBasicImage + data[0].BackgroundUrl;
        this.formControlsUpdate.TelegramChanalName.patchValue(data[0].TelegramChanalName);
        this.formControlsUpdate.InstagramUserName.patchValue(data[0].InstagramUserName);
        this.formControlsUpdate.InstagramPassword.patchValue(data[0].InstagramPassword);
        this.formControlsUpdate.TelegramUserName.patchValue(data[0].TelegramUserName);
        this.formControlsUpdate.TelegramBotToken.patchValue(data[0].TelegramBotToken);

        this.formControlsUpdate.Active.patchValue(data[0].Active);
        this.formControlsUpdate.City.patchValue(data[0].CityID_Basic);
        //------------------------combo--------------------------------------
        this.Country = this.service.Country.filter(a => a.ID == data[0].CountryID_Basic)
        this.City = this.service.City.filter(a => a.ID == data[0].CityID_Basic)
        this.CompanyGroup = this.service.CompanyGroup.filter(a => a.ID == data[0].CompanyGroupID_BaseData)
        this.CountryID = data[0].CountryID_Basic;
        this.CityID = data[0].CityID_Basic;
        this.CompanyGroupID = data[0].CompanyGroupID_BaseData;

        this.formControlsUpdate.NamadTag.patchValue(data[0].NamadTag);
        this.formControlsUpdate.LicenseTag1.patchValue(data[0].LicenseTag1);
        this.formControlsUpdate.LicenseTag2.patchValue(data[0].LicenseTag2);
        this.formControlsUpdate.VideoDefault_ImageUrl.patchValue(data[0].VideoDefault_ImageUrl);
        this.formControlsUpdate.SocialNetworks1_LogUrl.patchValue(data[0].SocialNetworks1_LogUrl);
        this.formControlsUpdate.SocialNetworks2_LogUrl.patchValue(data[0].SocialNetworks2_LogUrl);
        this.formControlsUpdate.SocialNetworks1_Url.patchValue(data[0].SocialNetworks1_Url);
        this.formControlsUpdate.SocialNetworks2_Url.patchValue(data[0].SocialNetworks2_Url);

        this.formControlsUpdate.HeaderColor.patchValue(data[0].HeaderColor);
        this.formControlsUpdate.ButtonColor.patchValue(data[0].ButtonColor);
        this.formControlsUpdate.HeaderFontColor.patchValue(data[0].HeaderFontColor);
        this.formControlsUpdate.ButtonFontColor.patchValue(data[0].ButtonFontColor);
        this.formControlsUpdate.PriceColor.patchValue(data[0].PriceColor);
        this.formControlsUpdate.PriceFontColor.patchValue(data[0].PriceFontColor);


        this.them.modal_open_edit = true;

      });
    

  }

  //*******************************Update*****************************************
  onUpdate() {
    

    this.isSubmittedUpdate = true;

    if (this.UpdateForm.invalid) {
      return;
    }
    else {

      var params: any = {
        ID: this.UpdateForm.controls.ID.value,
        Name: this.UpdateForm.controls.Name.value,
        Tell: this.UpdateForm.controls.Tell.value,
        Fax: this.UpdateForm.controls.Fax.value,
        WatsUpNumber: this.UpdateForm.controls.WatsUpNumber.value,
        SMSNumber: '',
        Email: this.UpdateForm.controls.Email.value,
        WebsiteUrl: this.UpdateForm.controls.WebsiteUrl.value,
        TelegramUrl: this.UpdateForm.controls.TelegramUrl.value,
        InstagramUrl: this.UpdateForm.controls.InstagramUrl.value,
        Mobile: this.UpdateForm.controls.Mobile.value,
        Active: this.UpdateForm.controls.Active.value,
        LogUser: this.UserName,
        CountryID_Basic: this.CountryID,
        CityID_Basic: this.CityID,
        CompanyGroupID_BaseData: this.CompanyGroupID,
        ContractName: this.UpdateForm.controls.ContractName.value,
        Description: this.UpdateForm.controls.Description.value,
        Address: this.UpdateForm.controls.Address.value,
        LogoUrl: this.UpdateForm.controls.LogoUrl.value,
        BackgroudUrl: this.UpdateForm.controls.BackgroudUrl.value,
        TelegramChanalName: this.UpdateForm.controls.TelegramChanalName.value,
        InstagramUserName: this.UpdateForm.controls.InstagramUserName.value,
        InstagramPassword: this.UpdateForm.controls.InstagramPassword.value,
        TelegramUserName: this.UpdateForm.controls.TelegramUserName.value,
        TelegramBotToken: this.UpdateForm.controls.TelegramBotToken.value,
      }

      this.service.Update(params);
      this.them.onResetPage(this.UpdateForm);
      this.them.modal_open_edit = false;
      this.them.selectedRowID = null;
      this.them.selectRow = false;
      this.ImageUpdateLogo = "../../../../assets/image/NoImage.png";
      this.ImageUpdateBack = "../../../../assets/image/NoImage.png";

    }
  }
  //*******************************Settings New*********************************
  onInsertSettings() {


    console.log(this.SettingsGroupForm.value);
    this.isSubmittedSettings = true;

    if (this.SettingsGroupForm.invalid) {
      return;
    }
    else {
      this.service.InserSettings(
        this.SettingsGroupForm.controls['Name'].value, this.UserName, this.GroupTypeID.toString(), this.Lang);
      this.isSubmittedSettings = false;
      this.SettingsGroupForm.reset();

    }
  }
  //------------------------ResetCombo-------------------------
  ResetCombo() {

    if (this.Country != null && this.Country.length > 0) {

      this.CountryID = this.Country[0].ID.toString();
    }
    else {
      this.CountryID = '';
    }
    if (this.City != null && this.City.length > 0) {

      this.CityID = this.City[0].ID.toString();
    }
    else {
      this.CityID = '';
    }
    if (this.CompanyGroup != null && this.CompanyGroup.length > 0) {

      this.CompanyGroupID = this.CompanyGroup[0].ID.toString();
    }
    else {
      this.CompanyGroupID = '';
    }
  }
  //*****************FileUploader************************
  fileData: File = null;
  fileProgress(fileInput: any, insert: boolean, type: string) {
    const formData = new FormData();
    var validsize: boolean = false;
    this.fileData = <File>fileInput[0];

    if (this.fileData.type.toLowerCase() == 'image/jpg' || this.fileData.type.toLowerCase() == 'image/jpeg' || this.fileData.type.toLowerCase() == 'image/png') {

      if (type == 'Logo') {
        formData.append('imageHeight', '256');
        formData.append('imageWidth', '256')
        validsize = this.them.CheckImageSize(this.fileData, 30);
      }
      else {

        validsize = this.them.CheckImageSize(this.fileData, 300);
      }



      if (validsize) {//سایز نامعتبر
        formData.append('file', this.fileData);
        formData.append('FolderName', '\\Company\\' + this.them.CompanyID + '\\');
        formData.append('path', "/Company/" + this.them.CompanyID + '/');
        this.api.FileUploader(formData).subscribe(data => {
          
          var body = data;
          if (body != 'Error') {//ابعاد تصویر نا معتبر است

            if (insert) {
              if (type == 'Logo') {
                this.formControls.LogoUrl.patchValue(body);
                this.ImageInsertLogo = this.configUrlBasicImage + body.toString();
              }
              else {
                this.formControls.BackgroudUrl.patchValue(body);
                this.ImageInsertBack = this.configUrlBasicImage + body.toString();
              }

            }
            else {
              if (type == 'Logo') {
                this.formControlsUpdate.LogoUrl.patchValue(body);

                this.ImageUpdateLogo = this.configUrlBasicImage + body.toString();
              }
              else {
                this.formControlsUpdate.BackgroudUrl.patchValue(body);
                this.ImageUpdateBack = this.configUrlBasicImage + body.toString();
              }

            }
          }
          else {
            if (this.Lang.toLowerCase().includes('fa')) {
              this.them.AlertLis.Title = 'خطا'
              this.them.AlertLis.Body = 'ابعاد تصویر نا معتبر است'
            }
            else {
              this.them.AlertLis.Title = 'Error'
              this.them.AlertLis.Body = 'Image dimensions are invalid'
            }

            this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
            this.them.ShowAlert('alert-warning');
          }
        })
      }
    }
    else {
      if (this.Lang.toLowerCase().includes('fa')) {
        this.them.AlertLis.Title = 'خطا'
        this.them.AlertLis.Body = 'فرمت قابل قبول jpg'
      }
      else {
        this.them.AlertLis.Title = 'Error'
        this.them.AlertLis.Body = 'Acceptable jpg format'
      }

      this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
      this.them.ShowAlert('alert-warning');
    }
  }
  fieldTextType: boolean;
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  onTelegramGroupChatID() {
    this.service.GetTelegramGroupChatID(this.them.CompanyID);
  }
  onTelegramUserChatID() {
    this.service.GetTelegramUserChatID(this.them.CompanyID);
  }
}






