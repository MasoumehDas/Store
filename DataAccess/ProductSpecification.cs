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
    
    public partial class ProductSpecification
    {
        public int ID { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public int GroupType { get; set; }
        public string Title { get; set; }
        public string GroupTypeName { get; set; }
        public string GroupTypeName_En { get; set; }
        public Nullable<bool> Active { get; set; }
        public Nullable<bool> Show { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string LogUser { get; set; }
        public Nullable<bool> IsDefault { get; set; }
    
        public virtual ProductGroup ProductGroup { get; set; }
    }
}
