using System;
using System.Threading.Tasks;
using DatingAPP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAPP.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        // inject the DataContext class from this folder, into this repository
        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Compare paramref name and password with the same value from the database
        /// </summary>
        /// <param name="username">user's username</param>
        /// <param name="password">user's password</param>
        /// <returns>The user with the properties loaded</returns>
        public async Task<User> Login(string username, string password)
        {
            // store the user
            // if there is no match in the db it will return null
            var user = await _context.Users.FirstOrDefaultAsync(x => 
                x.Username == username);

            // user was not found in the db
            if (user == null) return null;

            // invalid password provided by the user
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)) return null;

            // passwords match
            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            // pass in the key, wich is passwordSalt
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                // hash the new passoword based on the usre's unique salt(key) and the plain password
                // transfom the password string into an array of bytes
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for(int i = 0; i < computedHash.Length; i++)
                {
                    // compare the hash chr by chr to see if the stored user's hased password
                    // and the new compute hashed password match
                    if(computedHash[i] != passwordHash[i]) return false;
                }

                // hashed passwords match
                return true;
            }
        }

        /// <summary>
        /// Add a new user to the database and hash it's password
        /// </summary>
        /// <param name="user">username</param>
        /// <param name="password">plain password</param>
        /// <returns>User instance structure with values for passordSalt, passwordHash</returns>
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;

            // generate the user's password salt and password hash
            // out = pass a reference to the local vars passwordHash, passwordSalt
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            // add this user to the database (store it's password salt and hashed password)
            await _context.Users.AddAsync(user);

            // tell EF to commit the changes done to our database
            await _context.SaveChangesAsync();

            return user;
        }

        /// <summary>
        /// Create the user'sealed hashed password
        /// </summary>
        /// <param name="password">plain password</param>
        /// <param name="passwordHash"></param>
        /// <param name="passwordSalt"></param>
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // hmac holds a randomly generated key
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                // give the plain passoword a random salt = hmac.Key
                // hmac.Key = The secret key for System.Security.Cryptography.HMACSHA512 encryption. The key can be any length.
                passwordSalt = hmac.Key;

                // hash the new passoword based on the randomly generated key in hmac and the plain pass
                // transfom the password string into a byte[] and return this array
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            // AnyAsync returns true if user is found in the db, false otherwise
            if (await _context.Users.AnyAsync(x => x.Username == username)) return true;

            // if username is not found in the database, return true
            return false;
        }
    }
}