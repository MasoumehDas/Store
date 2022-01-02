import { Component, OnInit, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../shared/auth.service';
import { DenyMenu } from '../../shared/modules/UserAccess.module';
import { CompanyProductGroup } from '../../shared/modules/CompanyProductGroup.module';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { Company } from '../../shared/modules/Company.module';
import { them } from '../../shared/service/themplate.service';
import { ConfigService } from '../../shared/service/api.service';
@Component({
  selector: 'app-content-panel',
  templateUrl: './content-panel.component.html',
  styleUrls: ['./content-panel.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })),
      state('false', style({ opacity: 0.5, transform: 'translate3d(0, -10%, 0)' })),
      transition('1 => 0', animate('900ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ],
})
export class ContentPanelComponent implements OnInit {
  UserProfile: String = '';
  Deny: DenyMenu[] = [];
  public CompanyProductGroup: CompanyProductGroup[] = [];
  Companys: Company[] = [];
  UserName: string = this.authService.getUserName();
  UserID: string = this.authService.getUserID();
  isTop: boolean;
  public Lang: string = localStorage.getItem('language');
  searchTerm: any;

  constructor(public authService: AuthService, public them: them, private api: ConfigService) {
    this.them.loading = false;
  }

  logout() {
    this.authService.doLogout()
  }
  @Input() public submenu: boolean = false;
  isResponsive: string = '';

  public ResponsiveChange() {

    if (this.isResponsive == '') {
      this.isResponsive = 'hidde';
      return;

    }
    if (this.isResponsive == 'show') {
      this.isResponsive = 'hidde';
      return;
    }
    if (this.isResponsive == 'hidde') {
      this.isResponsive = 'show';
      return;
    }
  }
  onActivate(componentRef) {
    this.api.Fetch_FilterUserNotAcessMenuGet(this.Lang, this.UserName, this.authService.getRoleID(), '', '', 'true', '').subscribe(data => {
      this.Deny = data;
      console.log('Deny');
      console.log(this.Deny);

      for (let item of this.Deny) {

        var dd = item.SelectorID.toString();

        if (dd != null) {
          var gg = document.getElementById(dd);
          if (gg != null && gg != undefined) {
            document.getElementById(dd).style.display = "none";
          }

        }

      }

    });

  }

  ngOnInit() {
    this.UserProfile = localStorage.getItem('UserProfile');
    this.them.CompanyName = this.authService.getCompanyName();
    this.them.SetLanguage();


    this.onActivate(null)

    

    if (this.Lang == 'fa') {
      document.getElementById('boot_en').setAttribute("disabled", "disabled");
      document.getElementById('Panel_en').setAttribute("disabled", "disabled");

      document.getElementById('Panel_fa').removeAttribute("disabled");
    }
    else {
      document.getElementById('boot_fa').setAttribute("disabled", "disabled");
      document.getElementById('Panel_fa').setAttribute("disabled", "disabled");

      document.getElementById('Panel_en').removeAttribute("disabled");
    }
    this.api.Fetch_FilterCompanyProductGroupGet(this.them.CompanyID, this.Lang)
      .subscribe(data => {
        this.CompanyProductGroup = data;
      });
  }
  onCompanyList() {
    this.api.FetchCompany_Filter(this.Lang, this.UserName).subscribe(data => {
      this.Companys = data;

    });
  }

  SearchCompany() {
    if (this.searchTerm != null && this.searchTerm != "") {

      this.api.FetchCompany_FilterGet(this.Lang, this.searchTerm, this.UserName, null, null, null, null).subscribe(data => {
        this.Companys = data;

      });
    }
  }
  SelectCompany(ID: string, Title: string) {

    this.them.CompanyName = Title;
    this.them.CompanyID = ID
    localStorage.setItem('CompanyID', ID);
    localStorage.setItem('CompanyName', Title);

    window.location.reload();

  }
}
