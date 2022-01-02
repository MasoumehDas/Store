import { Component, OnInit } from '@angular/core';
import { them } from '../../../shared/service/themplate.service';
import { panelCompanySettings } from '../../../shared/service/panelCompanySettings.Service ';
import { AuthService } from './../../../shared/auth.service';
import { ConfigService } from '../../../shared/service/api.service';
import { FormBuilder } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-company-setting',
  templateUrl: './company-setting.component.html',
  styleUrls: ['./company-setting.component.css']
})
export class CompanySettingComponent implements OnInit {

  UserName: string;
  Lang: string;
  SettingType: string;
  Title: string;
  AnotherType: string = '';
  ActiveAnother: boolean = false;
  ActiveAnotherError: boolean = false;
  pageCount: number = 1;

  ID: number = 0;

  constructor(public service: panelCompanySettings, private formBuilder: FormBuilder, public them: them, public authService: AuthService,
    public activatedRoute: ActivatedRoute, public api: ConfigService, public router: Router, private parserFormatter: NgbDateParserFormatter) {

  }

  ngOnInit() {

    this.UserName = this.authService.getUserID();
    this.Lang = this.service.Lang;
    this.activatedRoute.queryParams.subscribe(params => {
      this.SettingType = params['id'];
      
    });
    this.service.Select(this.Lang, this.UserName, this.them.CompanyID, '');


  }

  onSave() {
    this.ActiveAnotherError = false;
    this.service.CompanySettings.forEach(a => a.Company_Settings.forEach(a => a.ResturanID = Number(this.them.CompanyID)));
    this.service.Insert(this.service.CompanySettings);


  }
}
