import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentPanelComponent } from './Panel/content-panel/content-panel.component';
import { ProductIndexComponent } from './Panel/content-panel/product-index/product-index.component';
import { LoginComponent } from './User/login/login.component';
//--------------------------login----------------------------
import { UserProfileComponent } from './User/user-profile/user-profile.component';
import { AuthGuard } from "./shared/auth.guard";
import { NotFoundComponent } from './shared/not-found/not-found.component';
//---------------------------------------------------------
import { CompanyIndexComponent } from './Panel/content-panel/company-index/company-index.component';
import { UserAccessComponent } from './User/user-access/user-access.component';
import { ProductGroupComponent } from './Panel/content-panel/product-group/product-group.component';
import { CompanyTransportationComponent } from './panel/content-panel/company-transportation/company-transportation.component';

import { PurchaseComponent } from './Panel/content-panel/purchase/purchase.component';
import { PageGeneratorComponent } from './Panel/content-panel/page-generator/page-generator.component';
import { WindowUploadComponent } from './Panel/content-panel/page-generator/window-upload/window-upload.component';

import { DefualtPageComponent } from './Panel/content-panel/defualt-page/defualt-page.component';
import { CompanySettingComponent } from './Panel/content-panel/company-setting/company-setting.component';
import { ProductCommentComponent } from './Panel/content-panel/product-comment/product-comment.component';
import { EditCompanyComponent } from './panel/content-panel/company-index/edit-company/edit-company.component';
import { PageMenuComponent } from './Panel/content-panel/page-menu/page-menu.component';
import { ProductGroupDetailComponent } from './panel/content-panel/product-group-detail/product-group-detail.component';
const routes: Routes = [


  { path: '404', component: NotFoundComponent },
  {
    path: 'Panel', component: ContentPanelComponent, canActivate: [AuthGuard],
    children: [
      { path: 'defualt-page', component: DefualtPageComponent, canActivate: [AuthGuard] },
      { path: 'product-index', component: ProductIndexComponent, canActivate: [AuthGuard] },
      { path: 'product-group', component: ProductGroupComponent, canActivate: [AuthGuard] },
      { path: 'company-index', component: CompanyIndexComponent, canActivate: [AuthGuard] },
      { path: 'purchase', component: PurchaseComponent, canActivate: [AuthGuard] },
      { path: 'page-genetor', component: PageGeneratorComponent, canActivate: [AuthGuard] },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
      { path: 'user-access', component: UserAccessComponent, canActivate: [AuthGuard] },
      { path: 'window-upload', component: WindowUploadComponent, canActivate: [AuthGuard] },
      { path: 'company-setting', component: CompanySettingComponent, canActivate: [AuthGuard] },
      { path: 'product-comment', component: ProductCommentComponent, canActivate: [AuthGuard] },
      { path: 'page-menu', component: PageMenuComponent, canActivate: [AuthGuard] },
      { path: 'edit-Company', component: EditCompanyComponent, canActivate: [AuthGuard] },
      { path: 'edit-product-Specification', component: ProductGroupDetailComponent, canActivate: [AuthGuard] },
      { path: 'company-transportation', component: CompanyTransportationComponent, canActivate: [AuthGuard] },
    ]
  },

  //---------------login
  { path: '**', component: LoginComponent },
  
  { path: 'login', component: LoginComponent },
  { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


