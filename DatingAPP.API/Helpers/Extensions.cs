using Microsoft.AspNetCore.Http;

namespace DatingAPP.API.Helpers
{
    // general purpose class
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            // heaser 1
            // message = exception message
            response.Headers.Add("Application-Error", message);

             // make the header above available to the browser
             // the value of the header above(ApplicationError)
             response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");

             // any origin is allowed to access this particular header
             response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
    }
}