using System.ComponentModel.DataAnnotations;

namespace DatingAPP.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required] // annotation. The username can not be empty
        public string Username { get; set; }

        [Required] // annotation. The password can not be empty
        // specify the maximul length of the string = 8
        [StringLength(8, MinimumLength = 4, ErrorMessage = "You must specify a password between 4 and 8 characters.")]
        public string Password { get; set; }
    }
}