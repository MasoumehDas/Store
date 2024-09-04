export class PageMenu {
  Active: boolean | undefined = undefined;
  CompanyID: Number | undefined = undefined;
  ID: Number | undefined = undefined;
  MenuTitle: string | undefined = undefined;
  SystemCode: Number | undefined = undefined;
  SystemName: string | undefined = undefined;
}
export class MenuView {

  MenuTitle: string | undefined = undefined;
  SystemCode: Number | undefined = undefined;
  subMenus: SubMenu[]=[]
}
export class SubMenu {

  PageTitle: string | undefined = undefined;
  ID: Number | undefined = undefined;

}
