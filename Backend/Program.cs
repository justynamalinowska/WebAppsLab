using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5000");

builder.Services.AddCors(opts =>
{
    opts.AddPolicy("AllowFrontend", p =>
        p.WithOrigins("http://localhost:5173")  
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials()
    );
});

var jwtSec = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSec);
var jwtSettings = jwtSec.Get<JwtSettings>()!;
var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

builder.Services
  .AddAuthentication(options =>
  {
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme       = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = GoogleDefaults.AuthenticationScheme;
  })
  .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, opts =>
  {
      opts.Cookie.SameSite     = SameSiteMode.None; 
      opts.Cookie.SecurePolicy = CookieSecurePolicy.Always;
  })
  .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opts =>
  {
      opts.RequireHttpsMetadata = false;
      opts.SaveToken            = true;
      opts.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuer           = true,
          ValidateAudience         = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer              = jwtSettings.Issuer,
          ValidAudience            = jwtSettings.Audience,
          IssuerSigningKey         = new SymmetricSecurityKey(key),
          ClockSkew                = TimeSpan.Zero
      };
  })
  .AddGoogle(GoogleDefaults.AuthenticationScheme, opts =>
  {
      opts.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
      opts.CallbackPath = "/api/auth/google-response";
      opts.ClientId     = builder.Configuration["Authentication:Google:ClientId"]!;
      opts.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;

      opts.CorrelationCookie.SameSite = SameSiteMode.None;
      opts.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always;
  });

builder.Services.AddAuthorization();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Lax,
    Secure = CookieSecurePolicy.SameAsRequest
});

// Auth
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
