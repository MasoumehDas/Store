export class CompanySettings {
  PageShow: Number | undefined = undefined;
  MaxPageShow: Number | undefined = undefined;
  PageDescription: String | undefined = undefined;
  Company_Settings: Company_Settings[] | undefined = undefined;
}
export class Company_Settings {
  ResturanID: Number | undefined = undefined;
  SettingName: String | undefined;
  SettinCaption: String | undefined;
  SettingValue: String | undefined;
  Descriptions: String | undefined;
  Category: String | undefined;
  PageShow: Number | undefined = undefined;
  Active: boolean | undefined = undefined;
  PageDescription: String | undefined = undefined;
}
