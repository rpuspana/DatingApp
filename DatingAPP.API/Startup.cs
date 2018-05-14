using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using DatingAPP.API.Data;
using DatingAPP.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // make services available
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // encode the password value ("super secret key") taken from appsettings.json-AppSettings-Token
            var key = Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token")
                        .Value);

            // tell it what db provider it will use
            services.AddDbContext<DataContext>(x => {
                x.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            
            services.AddMvc();

            services.AddCors();

            services.AddScoped<IAuthRepository, AuthRepository>();

            // configure type and authentication schema
            // type of authentication scheme used = JwtBearerDefaults
            // authenticatoin scheme = AuthenticationScheme
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {

                    // instrs on how to validate the token
                    options.TokenValidationParameters = new TokenValidationParameters{
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
        }

        // app middleware
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            // error handler on the API side
            if (env.IsDevelopment())
            {
                // handle exceptions globally
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder => {
                    builder.Run(async context => {
                        
                        // I have access to the http context

                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        // pass the error to the exception handlers and get it
                        var error = context.Features.Get<IExceptionHandlerFeature>();

                        if(error != null)
                        {
                            // write the error message in the response's header
                            context.Response.AddApplicationError(error.Error.Message);

                            // write error message in the response
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }

            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());

            // use the authenticate schema 
            app.UseAuthentication();

            // keep this last because this the part that returns the request
            //to the client
            app.UseMvc();
        }
    }
}
