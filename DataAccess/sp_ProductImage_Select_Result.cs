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
    
    public partial class sp_ProductImage_Select_Result
    {
        public int ID { get; set; }
        public Nullable<int> ProductID { get; set; }
        public string Image_Url { get; set; }
        public string Description { get; set; }
        public Nullable<bool> IsDefault { get; set; }
    }
}