//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DataAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class Company
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Company()
        {
            this.CompanyNameDetails = new HashSet<CompanyNameDetail>();
        }
    
        public int ID { get; set; }
        public string Name { get; set; }
        public string Tell { get; set; }
        public string Fax { get; set; }
        public string WatsUpNumber { get; set; }
        public string SMSNumber { get; set; }
        public string Email { get; set; }
        public string WebsiteUrl { get; set; }
        public string TelegramUrl { get; set; }
        public string TelegramBotToken { get; set; }
        public string TelegramChanalName { get; set; }
        public string TelegramChatID { get; set; }
        public string TelegramUserChatID { get; set; }
        public string TelegramUserName { get; set; }
        public string InstagramUrl { get; set; }
        public string InstagramUserName { get; set; }
        public string InstagramPassword { get; set; }
        public string LogoUrl { get; set; }
        public string BackgroudUrl { get; set; }
        public string Mobile { get; set; }
        public Nullable<bool> Active { get; set; }
        public string LogUser { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public Nullable<int> CountryID_BasicData { get; set; }
        public Nullable<int> CityID_BasicData { get; set; }
        public Nullable<int> CompanyGroupID_BaseData { get; set; }
        public string ContractName { get; set; }
        public string Description { get; set; }
        public Nullable<bool> IsDefault { get; set; }
        public string Address { get; set; }
        public string HeaderColor { get; set; }
        public string ButtonColor { get; set; }
        public string HeaderFontColor { get; set; }
        public string ButtonFontColor { get; set; }
        public string PriceColor { get; set; }
        public string PriceFontColor { get; set; }
        public Nullable<int> VisitedCount { get; set; }
        public Nullable<int> isParent { get; set; }
        public Nullable<int> ParentID { get; set; }
        public string NamadTag { get; set; }
        public string LicenseTag1 { get; set; }
        public string LicenseTag2 { get; set; }
        public string VideoDefault_ImageUrl { get; set; }
        public string SocialNetworks1_LogUrl { get; set; }
        public string SocialNetworks2_LogUrl { get; set; }
        public string SocialNetworks1_Url { get; set; }
        public string SocialNetworks2_Url { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CompanyNameDetail> CompanyNameDetails { get; set; }
    }
}
