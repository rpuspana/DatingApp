using DatingAPP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAPP.API.Data
{
    public class DataContext : DbContext
    {
        // tell Entity framework about the Value class
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        // tell the DataContext about the models 
        // name of class - table
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
    }
}