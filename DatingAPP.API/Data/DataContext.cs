using DatingAPP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAPP.API.Data
{
    public class DataContext : DbContext
    {
        // tell Entity framework about the Value class
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        // tell the DataContext about the models 
        //  DbSet<ClassName> TableName
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
    }
}