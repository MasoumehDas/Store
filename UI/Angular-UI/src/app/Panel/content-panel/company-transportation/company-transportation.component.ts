
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, PipeTransform, QueryList, ViewChildren, Injectable } from '@angular/core';


import { Basic } from '../../../shared/modules/BasicData.module';


import { them } from '../../../shared/service/themplate.service';
import { panelCompanyTransportation } from '../../../shared/service/panelCompanyTransportation.service';
import { CompanyTransportation } from '../../../shared/modules/CompanyTransportation.module';
import { ConfigService } from '../../../shared/service/api.service';
import { FormBuilder, Validators, FormGroup,AbstractControl } from '@angular/forms';
import { Observable, Subject, merge, BehaviorSubject } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '../../../shared/service/sortable.directive';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';//https://www.npmjs.com/package/ng-multiselect-dropdown



@Injectable()



@Component({
  selector: 'app-company-transportation',
  templateUrl: './company-transportation.component.html',
  styleUrls: ['./company-transportation.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('900ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ],
})

export class CompanyTransportationComponent implements OnInit {
  //*******************Grid Setting*********************
  List$: Observable<CompanyTransportation[]>;
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
  constructor(public service: panelCompanyTransportation,
    private formBuilder: FormBuilder,
    public them: them,
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

  isSubmitted = false;
  isSubmittedUpdate = false;
  isSubmittedSettings = false;
  disable = false;
  TransportationCalculateTitle:string;
  UserName: string;
  Lang: string;
  IsShowInFormUpdate:boolean=true;
  IsShowInFormInsert:boolean=true;
 

  public Message: string;

  //-------------------------------------------------------

  ngOnInit() {
    this.them.selectedRowID = null;
    this.them.selectRow = false;

    this.UserName = this.service.UserName;
    this.Lang = this.service.Lang;
    
    //(Lang: string,UserName: string,CompanyID: string,TransportationCalculate_BasicData: string)
    this.service.Select(this.Lang, this.service.UserID,  this.them.CompanyID,null);
    
    this.service.onTransportationCalculateGet(this.Lang);

    this.SearchForm = this.formBuilder.group({
      UserName: [''],
      TransportationCalculate_BasicData: [null],
    });

    
    this.InsertForm = this.formBuilder.group({
      Title: ['', [Validators.required]],
      CompanyID: [this.them.CompanyID, [Validators.required]],
      Factor: [''],
      TransportationCalculate_BasicData: ['', [Validators.required]],
      TransportationPrice: [''],
     

    });
    
    this.UpdateForm = this.formBuilder.group({
      ID: [''],
      Title: ['', [Validators.required]],
      CompanyID: [this.them.CompanyID, [Validators.required]],
      Factor: [''],
      TransportationCalculate_BasicData: ['', [Validators.required]],
      TransportationPrice: [''],
    });

   
  }
  get formControlsInsert() { return this.InsertForm.controls; }
  get formControlsUpdate() { return this.UpdateForm.controls; }
  
  
  //*****************Select******************************
  //(Lang: string,UserName: string,CompanyID: string,TransportationCalculate_BasicData: string)
  questioner() {
    
    
    this.service.Select(
      this.Lang,
      this.service.UserName,
      this.them.CompanyID,
      this.SearchForm.controls.TransportationCalculate_BasicData.value,
      
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

    if(this.IsShowInFormInsert && !this.InsertForm.controls.Factor.value)
    {
      this.InsertForm.controls.Factor.setErrors({ 'Factor': true });
    }
    if(this.IsShowInFormInsert && !this.InsertForm.controls.TransportationPrice.value)
    {
      this.InsertForm.controls.TransportationPrice.setErrors({ 'TransportationPrice': true });
    }
    if (this.InsertForm.invalid) {
      return;
    }
    else {

      var params: any = {
        Lang: this.Lang,
        UserName: this.service.UserName,
        CompanyID: this.them.CompanyID,
        Title: this.InsertForm.controls.Title.value,
        Factor: this.InsertForm.controls.Factor.value,
        TransportationPrice: this.InsertForm.controls.TransportationPrice.value,
        TransportationCalculate_BasicData: this.InsertForm.controls.TransportationCalculate_BasicData.value,
      }


      this.service.Insert(params);
      this.InsertForm.reset();
      this.IsShowInFormInsert=true;
      
      this.them.modal_open_new=false;
    }
  }
  //***********************Edit********************************
  EditOpen(selectedRowID) {
      this.them.selectedRowID=selectedRowID
      this.api.Fetch_FilterCompanyTransportationID(this.Lang, null, this.them.selectedRowID.toString()).subscribe(data => {
        this.formControlsUpdate.ID.patchValue(data[0].ID);
        this.formControlsUpdate.Title.patchValue(data[0].Title);
        this.formControlsUpdate.Factor.patchValue(data[0].Factor);
        this.formControlsUpdate.TransportationPrice.patchValue(data[0].TransportationPrice);
        this.formControlsUpdate.TransportationCalculate_BasicData.patchValue(data[0].TransportationCalculate_BasicData);
        this.TransportationCalculateTitle=this.service.TransportationCalculate.find(a=>a.CodeINT==data[0].TransportationCalculate_BasicData).Title;
        this.IsShowInFormUpdate=this.service.TransportationCalculate.find(a=>a.CodeINT==data[0].TransportationCalculate_BasicData).Show;
        this.them.modal_open_edit = true;
      });
    

  }

  //*******************************Update**********************
  onUpdate() {

    this.isSubmittedUpdate = true;
    if(this.IsShowInFormUpdate && !this.UpdateForm.controls.Factor.value)
    {
      this.UpdateForm.controls.Factor.setErrors({ 'Factor': true });
    }
    if(this.IsShowInFormUpdate && !this.UpdateForm.controls.TransportationPrice.value)
    {
      this.UpdateForm.controls.TransportationPrice.setErrors({ 'TransportationPrice': true });
    }
    if (this.UpdateForm.invalid) {
      return;
    }
    else {

      var params: any = {
        Lang: this.Lang,
        UserName:this.UserName,
        ID: this.UpdateForm.controls.ID.value,
        Title: this.UpdateForm.controls.Title.value,
        Factor: this.UpdateForm.controls.Factor.value,
        TransportationPrice: this.UpdateForm.controls.TransportationPrice.value,
        TransportationCalculate_BasicData: this.UpdateForm.controls.TransportationCalculate_BasicData.value,
        

      }

      this.service.Update(params);
      this.TransportationCalculateTitle='';
      this.them.modal_open_edit = false;
      this.them.selectedRowID = null;
      this.them.selectRow = false;

    }
  }
  
  onTransportationCalculateSelect(ID:any) {
    this.TransportationCalculateTitle=this.service.TransportationCalculate.find(a=>a.CodeINT==ID).Title;

  }
  
  onChangeTransportationCalculate_Edit(){
    var item=this.UpdateForm.controls.TransportationCalculate_BasicData.value
    this.IsShowInFormUpdate=  this.service.TransportationCalculate.find(a=>a.CodeINT==item).Show;
  }
  onChangeTransportationCalculate_New(){
    var item=this.InsertForm.controls.TransportationCalculate_BasicData.value;
    this.IsShowInFormInsert=  this.service.TransportationCalculate.find(a=>a.CodeINT==item).Show;
     }
}

