import { Component, OnInit } from '@angular/core';
import { DenyMenu } from '../../shared/modules/UserAccess.module';
import { Menu } from '../../shared/modules/UserAccess.module';
import { User } from '../../shared/modules/User';
import { panelUserAccess } from '../../shared/service/PanelUserAccess.service'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { them } from '../../shared/service/themplate.service';
import { UserRole } from '../../shared/modules/UserRole.module';
@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css']
})


export class UserAccessComponent implements OnInit {

  UserRoles: UserRole[] = [];
  UserRolesID: String = '';
  RowID: string = '';
  Allow: Menu[] = [];
  Menu: Menu[] = [];
  Deny: DenyMenu[] = [];
  denyAdd: DenyMenu = null;
  allowAdd: Menu = null;
  ID: Number = 0;
  Lang: string;
  UserName: string;
  constructor(public service: panelUserAccess, public them: them) { }

  ngOnInit() {
    this.Lang = this.service.Lang;
    this.UserName = this.service.UserName;
    this.service.onUserPofile_DefaultCompanyGet(this.Lang, this.UserName, '', '', '', this.them.CompanyID, null, '', '', '');

    this.service.onUserRoleGet(this.Lang);
    this.service.onSelectMenu();
    //this.service.onHeight()


    this.dropdownUserRoleSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'RoleName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.Allow = [];
    this.Deny = [];

  }//End onInit----------------------
  dropdownUserRoleSettings: IDropdownSettings = {};
  onItemSelectUserRoles(item: any) {
    this.UserRolesID = item.ID;
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }
  //-----------------------------------------------------------------
  SelectRow(ID: string) {

    this.RowID = ID;

  }
  //----------------------------------------------------------------
  questioner() {
    this.them.AlertLis.Body = '';
    if (this.UserRolesID == '' || this.UserRolesID == null) {

      if (this.Lang.toLowerCase() == 'fa') {
        this.them.AlertLis.Title = 'خطا';
        this.them.AlertLis.Body = 'لطفا سمت مورد نظر را انتخاب نمایید';
        this.them.AlertLis.Body = this.them.AlertLis.Body + '<br/>'

      }
      else {
        this.them.AlertLis.Title = 'Error';
        this.them.AlertLis.Body = 'Please select the desired role <br/>';

      }

    }
    if (this.RowID == '' || this.RowID == null) {
      if (this.Lang.toLowerCase() == 'fa') {
        this.them.AlertLis.Title = 'خطا';
        this.them.AlertLis.Body = this.them.AlertLis.Body + ' لطفا منو مورد نظر را انتخاب نمایید ';

      }
      else {
        this.them.AlertLis.Title = 'Error';
        this.them.AlertLis.Body = this.them.AlertLis.Body + ' Please select the desired menu ';

      }


    }
    if (this.them.AlertLis.Body != null && this.them.AlertLis.Body != '') {
      this.them.SeupAlert(this.them.AlertLis, 'alert-warning');
      this.them.ShowAlert('alert-warning');
    }
    else {
      this.service.onSelectMenuAccess(this.UserRolesID.toString(), this.RowID);
      this.service.onSelectMenuNotAccess(this.UserRolesID.toString(), this.RowID);
    }

  }
  //***************************Drag && Drop**************************

  allowDrop(ev) {
    ev.preventDefault();
    if (ev.target.getAttribute("draggable") == "true")
      ev.dataTransfer.dropEffect = "none"; // dropping is not allowed
    else
      ev.dataTransfer.dropEffect = "all"; // drop it like it's hot


  };
  //-----------------------------Drag--------------------------------------
  drag(ev, ID) {
    ev.dataTransfer.setData("id", ev.target.id);


    this.ID = ID
  };
  //--------------------------Drop-----------------------------------------
  drop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData("id");

    var targetID = ev.currentTarget.id



    var D = document.getElementById('Deny').childElementCount;
    var A = document.getElementById('Allow').childElementCount;

    if (this.ID > 0) {


      if (targetID === 'Deny') {
        var dd = Number((D * 48) + 100) + "px";
        var bb = Number(A * 48 - 50) + "px";
        document.getElementById('Deny').style.height = dd;

        this.denyAdd = this.service.AllowMenu.find(a => a.ID == this.ID.toString());
        this.service.DenyMenu.push(this.denyAdd);
        this.service.AllowMenu = this.service.AllowMenu.filter(a => a.ID != this.ID.toString());

        this.service.Delete(this.UserName, this.ID.toString());

      }
      else {

        document.getElementById('Allow').style.height = Number((A * 48) + 100) + "px";

        this.allowAdd = this.service.DenyMenu.find(a => a.ID == this.ID.toString());
        this.service.AllowMenu.push(this.allowAdd);
        this.service.DenyMenu = this.service.DenyMenu.filter(a => a.ID != this.ID.toString());
        this.onInsert(this.allowAdd.SelectorID);
      }


      var dragged = document.getElementById(id);
      //ev.target.appendChild(dragged);
      dragged.className += " dropped";
    }
  };
  //-----------------------------------------------------------------------
  onInsert(SelectorID) {
    var params: any = {
      Lang: this.Lang,
      SelectorID: SelectorID,
      RoleID: this.UserRoles[0].ID.toString(),
      UserName: this.UserName
    }
    this.service.Insert(params);

  }
}
