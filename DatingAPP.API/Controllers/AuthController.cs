using System.Threading.Tasks;
using DatingAPP.API.Dtos;
using DatingAPP.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingAPP.API.Data
{
    // Route = application can find this controller
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _repo;

        // inhject the AuthRepository
        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }

        // get info from the users
        // [FromBody] = tell the API to look in the body of the request for information
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserForRegisterDto userForRegisterDto)
        {
            // convert our username in a lowercase string and store it in a db
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

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
    }
}