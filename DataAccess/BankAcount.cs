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
    
    public partial class BankAcount
    {
        public int ID { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public string BankName { get; set; }
        public string Terminal { get; set; }
        public string Password { get; set; }
        public string ReturnURL { get; set; }
        public Nullable<bool> Active { get; set; }
    }
}