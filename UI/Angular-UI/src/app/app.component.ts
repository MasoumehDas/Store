import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { them } from './shared/service/themplate.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  
  
  language: string = this.them.DefaultLanguage.toString();
  
  constructor(private translate: TranslateService, public them: them) {
    
    this.language = localStorage.getItem('language')
    
    
    if (this.language != null) {
      translate.setDefaultLang(this.language.toString());
    }
    else {
      translate.setDefaultLang(this.them.DefaultLanguage.toString());
      localStorage.setItem('language', this.them.DefaultLanguage.toString());
      this.language = this.them.DefaultLanguage.toString();
    }

  }
  
  ngOnInit() {
    this.them.loading=false;
    if (this.language == 'fa') {
      document.getElementById('boot_en').setAttribute("disabled", "disabled");
      
    }
    else {
      document.getElementById('boot_fa').setAttribute("disabled", "disabled");
      
    }
    document.getElementById('Panel_en').setAttribute("disabled", "disabled");
    document.getElementById('Panel_fa').setAttribute("disabled", "disabled");
  }
}
