using System.Threading.Tasks;
using DatingAPP.API.Models;

namespace DatingAPP.API.Data
{
    // authentification respository interface
    public interface IAuthRepository
    {
        // password = user password in plain text
        Task<User> Register(User user, string password);

        Task<User> Login(string username, string password);

        // prevent duplicate users in the database
        Task<bool> UserExists(string username);
    }
}