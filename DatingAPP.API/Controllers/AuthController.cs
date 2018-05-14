using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingAPP.API.Dtos;
using DatingAPP.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingAPP.API.Data
{
    // Route = application can find this controller
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;

        // inhject the AuthRepository
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        }

        // get info from the users
        // [FromBody] = tell the API to look in the body of the request for information
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserForRegisterDto userForRegisterDto)
        {
           if (!string.IsNullOrEmpty(userForRegisterDto.Username))
           {
               // convert our username in a lowercase string and store it in a db
               userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
           }

            // if the username already exists in the database
            if (await _repo.UserExists(userForRegisterDto.Username))
            {
                // error is being sent back to the ModelState
                ModelState.AddModelError("Username", "Username already exists");
            }

            // validate the username and password (inside requests)
            if (!ModelState.IsValid)
            {
                // provide the errors to the client inside the model state
                return BadRequest(ModelState);
            }

            var userToCreate = new User
            {
                Username = userForRegisterDto.Username

                // passwordHash and passwordSalt are created in the Auth repository
            };

            // create this user in the repository
            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            // return a http response to the client, 201 Created
            return StatusCode(201);
        }

        [HttpPost("login")] // add another word to the URL aka api/auth/login
        public async Task<IActionResult> Login([FromBody] UserForLoginDto userForLoginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // login with username and password
            var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(),
                                                userForLoginDto.Password);

            // check if it's a user in the response
            if (userFromRepo == null)
            {
                // don't say if the user existed or not
                return Unauthorized();
            }

            // generating the token that will send back to the end user

            var tokenHandle = new JwtSecurityTokenHandler();

            //super secret key =  key to sign the token encoded in bytes array
            // like 7A 61 2B 41 77 59 42 2F 51 4F 79 32 50 2F 63 2F 77 2D
            // get the value of the password from appsettings.json-AppSettigns-Token
            var key = System.Text.Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);

            // token payload = describe token and what is going to be inside it
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                    new Claim(ClaimTypes.Name, userFromRepo.Username)
                }),
                Expires = DateTime.Now.AddDays(1),

                // token secret
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key),
                                            SecurityAlgorithms.HmacSha512Signature)
            };

            // create a JWT token
            var token = tokenHandle.CreateToken(tokenDescriptor);

            // Serialization = process of converting an object into a stream of bytes
            //  in order to store the object or transmit it to memory, a database, or a file.
            //  Its main purpose is to save the state of an object 
            //  in order to be able to recreate it when needed.
            // The reverse process is called deserialization.

            // serialize the token
            var tokenString = tokenHandle.WriteToken(token);

            // pass token to the client
            return Ok(new { tokenString });
        }
    }
}