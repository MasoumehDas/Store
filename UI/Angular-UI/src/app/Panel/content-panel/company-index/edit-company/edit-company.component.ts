import { Component, OnInit } from '@angular/core';
import { Company } from '../../../../shared/modules/Company.module';
import { Basic } from '../../../../shared/modules/BasicData.module';
import { them } from '../../../../shared/service/themplate.service';
import { panelCompany } from '../../../../shared/service/panelCompany.service';
import { AuthService } from './../../../../shared/auth.service';
import { ConfigService } from '../../../../shared/service/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {

  constructor(public service: panelCompany, private formBuilder: FormBuilder, public them: them, public authService: AuthService, public router: Router, public api: ConfigService) {
   
  }
  //-----------------------------------------------------------
 
  UpdateForm: FormGroup;
  
  
  isSubmittedUpdate = false;
  UserName: string;
  Lang: string;
  CityID: String = '';
  CityName: String = '';
  CountryID: String = '';
  CountryName: String = '';
  CompanyGroupID: String = '';
  CompanyGroupName: String = '';
  GroupTypeID: String = '';
  City: Basic[] = [];
  Country: Basic[] = [];
  CompanyGroup: Basic[] = [];
  GroupType: Basic[] = [];
  public Message: string;
  ImageSocialLogo1: string = "../../../../assets/image/sapp.png";
  ImageSocialLogo2: string = "../../../../assets/image/ble.png";
  ImageUpdateLogo: string = "../../../../assets/image/NoImage.png";

  ImageVideoBack: string = "../../../../assets/image/NoImage.png";
  ImageUpdateBack: string = "../../../../assets/image/NoImage.png";
  configUrlBasicImage: string = this.them.configUrlBasicImage

  //-------------------------------------------------------

  ngOnInit() {
    this.them.selectedRowID = null;
    this.them.selectRow = false;
    
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
      City: [null],
      Country: [null],
      CompanyGroup: [null],
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

    
    this.service.onCityGet(this.Lang);

    this.service.onCountryGet(this.Lang);
    this.service.onCompanyGroupGet(this.Lang);
    this.service.onGroupTypeGet(this.Lang);
    this.EditOpen(this.them.CompanyID);
    
  }
 
  get formControlsUpdate() { return this.UpdateForm.controls; }
  
  //********************Dropdown*******************************

 

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
        this.CountryName=this.Country[0].Title;
        this.CityID = data[0].CityID_Basic;
        this.CityName=this.City[0].Title;
        this.CompanyGroupID = data[0].CompanyGroupID_BaseData;
        this.CompanyGroupName=this.CompanyGroup[0].Title;
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
       
        this.ImageUpdateLogo = this.configUrlBasicImage + data[0].LogoUrl;
        this.ImageUpdateBack = this.configUrlBasicImage + data[0].BackgroundUrl;
        this.ImageSocialLogo1= this.configUrlBasicImage + data[0].SocialNetworks1_LogUrl;
        this.ImageSocialLogo2= this.configUrlBasicImage + data[0].SocialNetworks2_LogUrl;
        this.ImageVideoBack= this.configUrlBasicImage + data[0].VideoDefault_ImageUrl;
        
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

      this.service.Update(params,false);
      
      

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

            
            //ImageSocialLogo1
              if (type == 'Logo') {
                this.formControlsUpdate.LogoUrl.patchValue(body);

                this.ImageUpdateLogo = this.configUrlBasicImage + body.toString();
              }
              else if(type =='background') {
                this.formControlsUpdate.BackgroudUrl.patchValue(body);
                this.ImageUpdateBack = this.configUrlBasicImage + body.toString();
              }
        
              else if(type =='ImageSocialLogo1') {
                this.formControlsUpdate.SocialNetworks1_LogUrl.patchValue(body);
                this.ImageSocialLogo1 = this.configUrlBasicImage + body.toString();
              }
              else if(type =='ImageSocialLogo2') {
                this.formControlsUpdate.SocialNetworks2_LogUrl.patchValue(body);
                this.ImageSocialLogo2 = this.configUrlBasicImage + body.toString();
              }
              else if(type =='ImageVideo') {
                this.formControlsUpdate.VideoDefault_ImageUrl.patchValue(body);
                this.ImageVideoBack= this.configUrlBasicImage + body.toString();
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
  onFindSpecification(ID: string) {
    
    document.getElementById(ID).style.display = "block";
    
    
  }
  onSelectSpecification(ID: Number,DropName:string) {
    
    document.getElementById(DropName).style.display = "none";
    if(DropName=="CityList")
    {
      var dd= this.service.City.find(a=>a.ID==ID);
      this.CityName=dd.Title;
      this.CityID=dd.ID.toString();
    }
    if(DropName=="CountryList")
    {
      var dd= this.service.Country.find(a=>a.ID==ID);
      this.CountryName=dd.Title;
      this.CountryID=dd.ID.toString();
    }
    if(DropName=="CompanyGroupList")
    {
      var dd= this.service.CompanyGroup.find(a=>a.ID==ID);
      this.CompanyGroupName=dd.Title;
      this.CompanyGroupID=dd.ID.toString();
    }

  }
}


