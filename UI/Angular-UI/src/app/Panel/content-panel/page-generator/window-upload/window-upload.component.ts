import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { them } from '../../../../shared/service/themplate.service';

@Component({
  selector: 'app-window-upload',
  templateUrl: './window-upload.component.html',
  styleUrls: ['./window-upload.component.css']
})
export class WindowUploadComponent implements OnInit {
  
  constructor(public them: them, private sanitizer: DomSanitizer, public activatedRoute: ActivatedRoute, public router: Router) { }
  

  url: string = "";
  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      
      this.url= this.them.ShowCkEditorUrlBasic+"companyId=" + this.them.CompanyID 
      if (params['id'] != undefined) {
        this.url = this.url+"&id="+params['id'];
      }
      
    });
  }
  
  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  onClose() {
    this.router.navigate(['/Panel/page-genetor']);
  }
}
