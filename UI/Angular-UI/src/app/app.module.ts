

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';//, HTTP_INTERCEPTORS  For login
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//-------------------------------------------------------------------
import { ConfigService } from './shared/service/api.service';
import { them } from './shared/service/themplate.service';
//----------------------------------------------------
import { LoginComponent } from './User/login/login.component';
//--------------------------login----------------------------
import { UserProfileComponent } from './User/user-profile/user-profile.component';

//----------------------------------------------------
import { ContentPanelComponent } from './Panel/content-panel/content-panel.component';
import { ProductIndexComponent } from './Panel/content-panel/product-index/product-index.component';
import { PurchaseComponent } from './Panel/content-panel/purchase/purchase.component';
//-----------------------------Translate--------------

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//-----------------------------------------------------
import { NgbdSortableHeader } from './shared/service/sortable.directive';
import { NgbPaginationModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';

//--------------------------------https://www.npmjs.com/package/ng-multiselect-dropdown
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { CompanyIndexComponent } from './Panel/content-panel/company-index/company-index.component';
import { UserAccessComponent } from './User/user-access/user-access.component';
import { ProductGroupComponent } from './Panel/content-panel/product-group/product-group.component';
import { PageGeneratorComponent } from './Panel/content-panel/page-generator/page-generator.component';
import { WindowUploadComponent } from './Panel/content-panel/page-generator/window-upload/window-upload.component';
import { DefualtPageComponent } from './Panel/content-panel/defualt-page/defualt-page.component';
import { CompanySettingComponent } from './Panel/content-panel/company-setting/company-setting.component';
import { ProductCommentComponent } from './Panel/content-panel/product-comment/product-comment.component';
import { PageMenuComponent } from './Panel/content-panel/page-menu/page-menu.component';
import { EditCompanyComponent } from './panel/content-panel/company-index/edit-company/edit-company.component';
import { PaymentComponent } from './panel/content-panel/payment/payment.component';
import { ProductGroupDetailComponent } from './panel/content-panel/product-group-detail/product-group-detail.component';
import { CompanyTransportationComponent } from './panel/content-panel/company-transportation/company-transportation.component';
import { ImageCropperModule } from 'ngx-image-cropper';



export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        
        LoginComponent,
        NgbdSortableHeader,
        ContentPanelComponent,
        ProductIndexComponent,
        UserProfileComponent,
        AppComponent,
        LoginComponent,
        NgbdSortableHeader,
        ContentPanelComponent,
        ProductIndexComponent,
        UserProfileComponent,
        NotFoundComponent,
        CompanyIndexComponent,
        UserAccessComponent,
        ProductGroupComponent,
        PurchaseComponent,
        
        PageGeneratorComponent,
        WindowUploadComponent,
        
        DefualtPageComponent,
        CompanySettingComponent,
        ProductCommentComponent,
       
        PageMenuComponent,
       
        EditCompanyComponent,
       
        PaymentComponent,
       
        ProductGroupDetailComponent,
       
        CompanyTransportationComponent,
 
        
        
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgbPaginationModule,
        NgbAlertModule,
        NgbModule,
        ImageCropperModule,
        NgMultiSelectDropDownModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
      }),

      
    ],
  providers: [ConfigService, them, DecimalPipe, NgbdSortableHeader],
    bootstrap: [AppComponent]
})
export class AppModule { }

