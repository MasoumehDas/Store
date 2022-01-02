import { Component, OnInit, QueryList, ViewChildren, Injectable, EventEmitter } from '@angular/core';
import { Order } from '../../../shared/modules/Order.module';
import { BasicData } from '../../../shared/modules/BasicData.module';
import { them } from '../../../shared/service/themplate.service';
import { NuLLValue } from '../../../shared/service/NullValue.sevice';
import { panelProductUserComment } from '../../../shared/service/ProductUserComment.service';
import { AuthService } from './../../../shared/auth.service';
import { ConfigService } from '../../../shared/service/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, interval } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '../../../shared/service/sortable.directive';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbDateStruct, NgbCalendar, NgbDatepickerI18n, NgbCalendarPersian, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';//https://www.npmjs.com/package/ng-multiselect-dropdown
import { ProductUserComment } from '../../../shared/modules/ProductUserComment.module';

@Component({
  selector: 'app-product-comment',
  templateUrl: './product-comment.component.html',
  styleUrls: ['./product-comment.component.css']
})
export class ProductCommentComponent implements OnInit {

  List$: Observable<ProductUserComment[]>;
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
  constructor(public service: panelProductUserComment, private formBuilder: FormBuilder, public them: them, public authService: AuthService, public router: Router, public api: ConfigService, private parserFormatter: NgbDateParserFormatter) {
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
      ProductID: ['']

    });

    this.UserName = this.service.UserName;
    this.Lang = this.service.Lang;

    this.service.Select(this.Lang, this.UserName, null,'', this.them.CompanyID, null);

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

    this.service.Select(
      this.Lang,
      this.UserName,
      this.them.CompanyID, null,
      this.SearchForm.controls.PageContent.value, null)

  }


  onActive(ID: string, Active: string) {

    var params: any = {
      Lang: this.Lang,
      UserName: this.UserName,
      ID: ID,
      Active: Active,

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
  
}
