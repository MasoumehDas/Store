import { Component, OnInit, QueryList, ViewChildren, Injectable } from '@angular/core';
import { them } from '../../../shared/service/themplate.service';
import { NuLLValue } from '../../../shared/service/NullValue.sevice';
import { panelPageMenu } from '../../../shared/service/panelPageMenu.Service';
import { AuthService } from './../../../shared/auth.service';
import { ConfigService } from '../../../shared/service/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, interval } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '../../../shared/service/sortable.directive';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NgbDateStruct, NgbCalendar, NgbDatepickerI18n, NgbCalendarPersian, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.css']
})
export class PageMenuComponent implements OnInit {

  UserName: string;
  Lang: string;

  ID: number = 0;

  constructor(public service: panelPageMenu, private formBuilder: FormBuilder, public them: them, public authService: AuthService,
    public activatedRoute: ActivatedRoute, public api: ConfigService, public router: Router, private parserFormatter: NgbDateParserFormatter) {

  }

  ngOnInit() {

    this.UserName = this.authService.getUserID();
    this.Lang = this.service.Lang;
    
    this.service.Select(this.Lang, this.UserName, this.them.CompanyID);


  }

  onSave() {
   
    this.service.Update(this.service.PageMenu);


  }

}
