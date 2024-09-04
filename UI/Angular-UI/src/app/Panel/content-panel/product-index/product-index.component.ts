import { Component, OnInit, QueryList, ViewChildren, Injectable } from '@angular/core';
import { Product } from '../../../shared/modules/Product.module';
import { BasicData } from '../../../shared/modules/BasicData.module';
import { them } from '../../../shared/service/themplate.service';
import { panelProcuct } from '../../../shared/service/panelProduct.service';
import { AuthService } from './../../../shared/auth.service';
import { ConfigService } from '../../../shared/service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductInsert } from '../../../shared/modules/Product.module';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NuLLValue } from '../../../shared/service/NullValue.sevice';
import { ProductDetailSpecification } from '../../../shared/modules/Product.module';
import { detail } from '../../../shared/modules/Product.module';
import { Observable } from 'rxjs';
import { ParamShowSearch } from '../../../shared/modules/ParamShowSearch.module';
import { NgbdSortableHeader, SortEvent } from '../../../shared/service/sortable.directive';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbDateStruct, NgbDatepickerI18n, NgbCalendar, NgbCalendarPersian, NgbDateParserFormatter, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { IDropdownSettings } from 'ng-multiselect-dropdown';//https://www.npmjs.com/package/ng-multiselect-dropdown
import { DecimalPipe } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css'],
  providers: [

    { provide: localStorage.getItem('language') == 'fa' ? NgbCalendar : NuLLValue, useClass: localStorage.getItem('language') == 'fa' ? NgbCalendarPersian : NuLLValue },

    { provide: localStorage.getItem('language') == 'fa' ? NgbDatepickerI18n : NuLLValue, useClass: localStorage.getItem('language') == 'fa' ? NgbDatepickerI18nPersian : NuLLValue }
    , them, panelProcuct, DecimalPipe, ConfigService, NgbPopover
  ],

  //animations: [
  //  trigger('visibilityChanged', [
  //    state('true', style({ opaSpecification: 1, transform: 'scale(1.0)' })),
  //    state('false', style({ opaSpecification: 0, transform: 'scale(0.0)' })),
  //    transition('1 => 0', animate('900ms')),
  //    transition('0 => 1', animate('900ms'))
  //  ])
  //],
})

export class ProductIndexComponent implements OnInit {

  List$: Observable<Product[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  fileData: any[] = [];

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
  constructor(public service: panelProcuct,
    private formBuilder: FormBuilder,
    public them: them,
    public authService: AuthService,
    public router: Router,
    public api: ConfigService,
    public activatedRoute: ActivatedRoute,
    private parserFormatter: NgbDateParserFormatter
  ) {
    this.List$ = service.List$;
    this.total$ = service.total$;
  }
  //-----------------------------------------------------------
  SearchForm: FormGroup;
  InsertForm: FormGroup;
  UpdateForm: FormGroup;
  GalleryForm: FormGroup;
  SettingsGroupForm: FormGroup;
  isSubmitted = false;
  isSubmittedSettings = false;
  isSubmittedUpdate = false;
  modal_Image_Gallery: boolean = false;
  UserName: string;
  Lang: string;
  SpecificationID: String = '';

  ProductGroupID: string = '13';
  CompanyID: string = '1';
  GroupTypeID: String = '';
  ProductInsert: ProductInsert;
  public details: detail[] = [];
  public ProductDetailSpecification: ProductDetailSpecification[];
  Specification: BasicData[] = [];


  GroupType: BasicData[] = [];
  public Message: string;
  ImageInsert: string = "../../../../assets/image/NoImage.png";
  ImageUpdate: string = "../../../../assets/image/NoImage.png";

  configUrlBasicImage: string = this.them.configUrlBasicImage;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  //-------------------------------------------------------
  public ParamShowSearch: ParamShowSearch[];

  ngOnInit() {
    this.them.selectedRowID = null;
    this.them.selectRow = false;
    this.UserName = this.service.UserName;
    this.Lang = this.service.Lang;
    this.CompanyID = this.them.CompanyID;
    this.activatedRoute.queryParams.subscribe(params => {
      this.details = [];
      this.them.modal_open_new = false;
      this.ProductGroupID = params['id'];
      this.them.ProductGroupName = params['ProductGroupName'];
      this.service.SelectCompanyTransportationGet();
      this.service.Select(this.UserName, this.Lang, '', this.CompanyID, this.ProductGroupID, '', '',
        null, null, null, null, null, null, null, true, null);

      this.details = this.service.onProductDetailGet(this.UserName, this.Lang, this.ProductGroupID);
      this.service.onSpecificationGet(this.Lang, this.ProductGroupID);

      this.ProductInsert = {
        ID: null,
        CompanyID: Number(this.them.CompanyID),
        TransportationID: -1,
        PriceBuy: null,
        PriceSales: null,
        IsAvailable: true,
        OffPercent: null,
        ProductGroupID: Number(this.ProductGroupID),
        Currency: 'Tom',
        LogUser: this.UserName,
        Acive: true,
        AvailableCount: 1,
        SalesCount: 0,
        IsSpecialSales: false,
        FromDateSpecialSales: '',
        ToDateSpecialSales: '',
        BarCode: '',
        ImageUrl: '',
        Name: '',
        Description: '',
        Lang: this.Lang,
        IsViewInstagram: false,
        IsViewTelegram: false,
        InstagramTag: '',
        IsOffPercent: false,

      };
      this.ImageInsert = "../../../../assets/image/NoImage.png";
      this.ImageUpdate = "../../../../assets/image/NoImage.png";
      this.ProductDetailSpecification = [];
    });




    this.SearchForm = this.formBuilder.group({
      BarCode: [''],
      Name: [''],
      IsAvailable: [null],
      Acive: [null],
      IsViewTelegram: [null],
      IsViewInstagram: [null],
      IsSendInstagram: [null],
      IsSendTelegram: [null],
      IsSpecialSales: [null],
      Specification: [null],

    });

    this.SettingsGroupForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      GroupType: [null, [Validators.required]],
    });
    this.GalleryForm = this.formBuilder.group({
      ImageUrl: [''],
      ProductID: [null],
    });

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

  onItemSelectSpecification(item: any) {
    this.SpecificationID = item.GroupType;
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
    this.service.Select(this.UserName, this.Lang, '', this.CompanyID, this.ProductGroupID, this.SearchForm.controls.BarCode.value, this.SearchForm.controls.Name.value
      , this.SearchForm.controls.IsAvailable.value, this.SearchForm.controls.Acive.value, this.SearchForm.controls.IsViewTelegram.value,
      this.SearchForm.controls.IsViewInstagram.value, this.SearchForm.controls.IsSendInstagram.value, this.SearchForm.controls.IsSendTelegram.value, this.SearchForm.controls.IsSpecialSales.value
      , true, this.SearchForm.controls.Specification.value
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


    this.ProductInsert.FromDateSpecialSales = this.parserFormatter.format(this.ProductInsert.FromDateSpecialSales)
    this.ProductInsert.ToDateSpecialSales = this.parserFormatter.format(this.ProductInsert.ToDateSpecialSales)

    var PostData: any = {
      product: this.ProductInsert,
      detail: this.details
    }
    this.service.Insert(PostData);

    this.oClose();

  }
  //***********************Edit********************************
  EditOpen(selectedRowID) {

    this.them.selectedRowID = selectedRowID;

    this.ResetDefaultValue();

    this.api.Fetch_FilterProductID(this.Lang, this.UserName, this.them.selectedRowID.toString()).subscribe(data => {

      this.ProductInsert.ID = data[0].ID;
      this.ProductInsert.CompanyID = data[0].CompanyID;
      this.ProductInsert.PriceBuy = data[0].PriceBuy;
      this.ProductInsert.PriceSales = data[0].PriceSales;
      this.ProductInsert.IsAvailable = data[0].IsAvailable;
      this.ProductInsert.OffPercent = data[0].OffPercent;
      this.ProductInsert.ProductGroupID = data[0].ProductGroupID;
      this.ProductInsert.Currency = data[0].Currency;
      this.ProductInsert.LogUser = data[0].LogUser;
      this.ProductInsert.Acive = data[0].Acive;
      this.ProductInsert.AvailableCount = data[0].AvailableCount;
      this.ProductInsert.SalesCount = data[0].SalesCount;
      this.ProductInsert.IsSpecialSales = data[0].IsSpecialSales;
      this.ProductInsert.FromDateSpecialSales = data[0].FromDateSpecialSales;
      this.ProductInsert.ToDateSpecialSales = data[0].ToDateSpecialSales;
      this.ProductInsert.Description = data[0].ProductDescription;

      this.ProductInsert.IsViewInstagram = data[0].IsViewInstagram;
      this.ProductInsert.IsViewTelegram = data[0].IsViewTelegram;
      this.ProductInsert.InstagramTag = data[0].InstagramTag;
      this.ProductInsert.IsOffPercent = data[0].IsOffPercent;
      this.ProductInsert.TransportationID = data[0].TransportationID == null ? -1 : data[0].TransportationID;
      if (this.Lang == 'en') {

        this.ProductInsert.FromDateSpecialSales = this.them.ToDate(data[0].FromDateSpecialSales_Mila);
        this.ProductInsert.ToDateSpecialSales = this.them.ToDate(data[0].ToDateSpecialSales_Mila);

      }
      if (this.Lang == 'fa') {
        this.ProductInsert.FromDateSpecialSales = this.them.ToDate(data[0].FromDateSpecialSales);
        this.ProductInsert.ToDateSpecialSales = this.them.ToDate(data[0].ToDateSpecialSales);


      }

      this.ProductInsert.BarCode = data[0].BarCode;
      this.ProductInsert.ImageUrl = data[0].ImageUrl;
      this.ProductInsert.Name = data[0].Name;
      this.ImageInsert = this.them.configUrlBasicImage + data[0].ImageUrl;

      this.details = this.service.details_themp;
      console.log("details");
      console.log(this.details);
      this.api.Fetch_FilterProductDetail_SpecificationGet(this.Lang, this.UserName, this.them.selectedRowID.toString()).subscribe(data => {

        this.ProductDetailSpecification = data;

        for (let item of this.ProductDetailSpecification) {
          var dd = this.details.find(a => a.ParamSearch == item.GroupTypeName);
          if (dd != undefined) {
            this.details.find(a => a.ParamSearch == item.GroupTypeName).PeropertyItems.push({ Text: item.Title, ID: item.ID })
          }

        }
        console.log("details_themp");
        console.log(this.service.details_themp);
        this.them.loading = false;
      });

      this.them.modal_open_new = true;


    });


  }


  OpenNew() {
    this.ResetDefaultValue();
    this.them.modal_open_new = !this.them.modal_open_new;
  }

  private ResetDefaultValue() {
    this.ProductDetailSpecification = [];
    this.imageChangedEvent = null;
    this.fileData = null;
    this.croppedImage = null;
    this.them.loading = true;
  }

  //------------------------ResetCombo-------------------------
  ResetCombo() {


    if (this.Specification != null && this.Specification.length > 0) {

      this.SpecificationID = this.Specification[0].ID.toString();
    }
    else {
      this.SpecificationID = '';
    }

  }
  oldParamSearch: string = '';


  onFindSpecification(ParamSearch: string, value: string) {


    if (this.oldParamSearch != '') {
      document.getElementById(this.oldParamSearch).style.display = "none";
    }
    document.getElementById(ParamSearch).style.display = "block";
    var list = this.service.details_themp.find(a => a.ParamSearch == ParamSearch).listDeatils;

    if (list.length <= 1) {

      this.service.details_themp.find(a => a.ParamSearch == ParamSearch).listDeatils = [];
      this.service.details_themp.find(a => a.ParamSearch == ParamSearch).listDeatils = this.service.Specification.filter(a => a.GroupTypeName_Fa == ParamSearch)
    }

    console.log(this.details);
    var bb = this.service.details_themp.find(a => a.ParamSearch == ParamSearch);
    var dd = bb.listDeatils.filter(a => a.Title.includes(value));
    var cc = this.details.find(a => a.ParamSearch == ParamSearch)
    cc.listDeatils = dd;
    console.log(this.service.details_themp);
    this.oldParamSearch = ParamSearch;

  }
  onFindSpecificationclick(ParamSearch: string) {

    if (this.oldParamSearch != '') {
      document.getElementById(this.oldParamSearch).style.display = "none";
    }
    document.getElementById(ParamSearch).style.display = "block";
    var list = this.service.details_themp.find(a => a.ParamSearch == ParamSearch).listDeatils;
    this.service.details_themp.find(a => a.ParamSearch == ParamSearch).Specification = '';
    if (list.length <= 1) {

      this.service.details_themp.find(a => a.ParamSearch == ParamSearch).listDeatils = [];
      this.service.details_themp.find(a => a.ParamSearch == ParamSearch).listDeatils = this.service.Specification.filter(a => a.GroupTypeName_Fa == ParamSearch)
    }

    this.oldParamSearch = ParamSearch;

  }
  onSelectSpecification(ID: number, Title: string, ParamSearch: string) {

    //document.getElementById(ParamSearch).style.display = "none";
    var count = this.details.find(a => a.ParamSearch == ParamSearch).PeropertyItems.filter(a => a.ID == ID).length
    if (count == 0) {
      this.oldParamSearch = ParamSearch;
      this.details.find(a => a.ParamSearch == ParamSearch).Specification = Title;
      this.details.find(a => a.ParamSearch == ParamSearch).ID = ID;
      this.details.find(a => a.ParamSearch == ParamSearch).PeropertyItems.push({ Text: Title.toString(), ID: ID })
    }

  }
  RemoveItems(ID: number, ParamSearch: string) {
    this.details.find(a => a.ParamSearch == ParamSearch).PeropertyItems = this.details.find(a => a.ParamSearch == ParamSearch).PeropertyItems.filter(a => a.ID != ID)
  }
  //---------------------SAVE IMAGE--------------------------------------


  fileProgressInsert(fileInput: any) {




    this.fileData[0] = <File>fileInput[0];
    var size = 5024;
    const formData = new FormData();
    ;
    if (this.fileData[0].type.toLowerCase() == 'image/jpg' || this.fileData[0].type.toLowerCase() == 'image/jpeg' || this.fileData[0].type.toLowerCase() == 'video/mp4') {
      if (this.fileData[0].type.toLowerCase() == 'video/mp4') {
        size = 50000;

      }
      if (this.them.CheckImageSize(this.fileData[0], size)) {


        formData.append('FolderName', "\\Product\\" + this.them.CompanyID + "\\");
        formData.append('path', "/Product/" + this.them.CompanyID + "/");
        formData.append('file', this.fileData[0]);
        this.them.loading = true;
        this.api.FileUploader(formData).subscribe(data => {

          var body = data;
          this.ProductInsert.ImageUrl = body.toString();
          this.ImageInsert = this.configUrlBasicImage + body.toString();
          this.them.loading = false;

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
  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    debugger;
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    //var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var mimeString = 'image/jpg'
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }
  //------------------------Image Gallery----------------------
  openImageGallery(ProductID: any) {


    this.modal_Image_Gallery = true;
    this.them.selectedRowID = ProductID;
    this.service.ProductImage = [];
    this.service.onProductImages(this.Lang, this.UserName, this.them.selectedRowID.toString());


  }
  closeImageGallery() {
    this.modal_Image_Gallery = false;
    this.ImageUpdate = "../../../../assets/image/NoImage.png";
  }
  fileProgressGallery(fileInput: any) {

    /*this.fileData = <File>fileInput[0];*/
    this.fileData = [];
    this.fileData.push(<File>fileInput);

    for (let i = 0; i <= this.fileData.length; i++) {
      let file = <File>fileInput[i]
      var size = 5024;
      const formData = new FormData();
      if (file.type.toLowerCase() == 'image/jpg' || file.type.toLowerCase() == 'image/jpeg' || file.type.toLowerCase() == 'video/mp4') {
        if (file.type.toLowerCase() == 'video/mp4') {
          size = 50000;
        }
        if (this.them.CheckImageSize(file, size)) {


          formData.append('FolderName', "\\Product\\" + this.them.CompanyID + "\\");
          formData.append('path', "/Product/" + this.them.CompanyID + "/");
          formData.append('file', file);
          this.api.FileUploader(formData).subscribe(data => {

            var body = data;
            //this.formControlsInsert.ImageID.patchValue(body);
            this.ImageUpdate = this.configUrlBasicImage + body.toString();

            //----Insert Image DataBase------------------------------
            var params = {
              ProductID: this.them.selectedRowID,
              Image_Url: body,
              IsDefault: false,
              Description: ''
            }
            this.service.InsertImage(params, this.them.selectedRowID.toString());


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

  }
  DeleteImage(ID: string) {
    this.service.DeleteImage(this.UserName, ID, this.them.selectedRowID.toString());

  }
  onSendInstagarm() {
    this.service.SendToInstagram(this.them.CompanyID);
  }
  onSendTelegram() {
    this.service.SendToTelegram(this.them.CompanyID);
  }
  oClose() {
    this.ProductInsert = {
      ID: null,
      CompanyID: Number(this.them.CompanyID),
      TransportationID: -1,
      PriceBuy: null,
      PriceSales: null,
      IsAvailable: true,
      OffPercent: null,
      ProductGroupID: Number(this.ProductGroupID),
      Currency: 'Tom',
      LogUser: this.UserName,
      Acive: true,
      AvailableCount: 1,
      SalesCount: 0,
      IsSpecialSales: false,
      FromDateSpecialSales: '',
      ToDateSpecialSales: '',
      BarCode: '',
      ImageUrl: '',
      Name: '',
      Description: '',
      Lang: this.Lang,
      IsViewInstagram: false,
      IsViewTelegram: false,
      InstagramTag: '',
      IsOffPercent: false

    };
    this.ImageInsert = "../../../../assets/image/NoImage.png";
    this.ImageUpdate = "../../../../assets/image/NoImage.png";

    this.them.modal_open_new = false;
    this.them.modal_open_edit = false;
    this.fillDatails();
  }
  fillDatails() {

    this.service.details_themp = [];
    for (let item of this.service.ParamShowSearch) {
      var b: detail = {
        listDeatils: this.service.Specification.filter(a => a.GroupTypeName_Fa == item.GroupTypeName),
        ParamSearch: item.GroupTypeName,
        ParamName: item.GroupTypeName,
        ID: null,
        Specification: '',
        PeropertyItems: [],
        Specification_new: ''
      }
      this.service.details_themp.push(b);

    }
    this.details = this.service.details_themp;
  }
  onEditPrice(Price: Number, ID: Number) {
    var params = {
      ID: ID,
      PriceSales: Price

    }
    this.service.Update(params);
  }
  Title = 'World';
  toggleWithGreeting(popover, title: string) {
    debugger
    this.Title = title
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({ title });
    }
  }
  SaveNewSpecification(popover, ParamSearch, NewSpecification) {
    debugger;
    if (this.details.find(a => a.ParamSearch == ParamSearch).listDeatils.filter(a => a.Title == NewSpecification).length == 0) {
      var param = {
        GroupType: ParamSearch,
        Title: NewSpecification,
        ID: 0,
        Active: true,
        Show: true,
        CreateDate: '',
        UpdateDate: '',
        LogUser: '',
        IsDefault: true,
        GroupTypeName_Fa: ParamSearch,
        GroupTypeName_En: ParamSearch,
        CompanyID: this.them.CompanyID,

      }
      this.details.find(a => a.ParamSearch == ParamSearch).listDeatils.push(param);
      this.details.find(a => a.ParamSearch == ParamSearch).PeropertyItems.push({ Text: NewSpecification, ID: null })
    }

    if (popover.isOpen()) {
      popover.close();
    }


  }

}





