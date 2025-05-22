using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// --- (opcjonalnie) uruchom pod http://localhost:5000
builder.WebHost.UseUrls("http://localhost:5000");

// --- 1) CORS: pozwól na AJAX + cookies z frontu
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("AllowFrontend", p =>
        p.WithOrigins("http://localhost:5173")   // 👉 Twój Vite/CRA URL
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials()
    );
});

// --- 2) Wczytaj JwtSettings z appsettings.json
var jwtSec = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSec);
var jwtSettings = jwtSec.Get<JwtSettings>()!;
var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

// --- 3) Authentication + Authorization
builder.Services
  .AddAuthentication(options =>
  {
    // Cookie będzie trzymać stan OAuth (state, correlation)
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme       = CookieAuthenticationDefaults.AuthenticationScheme;
    // Jeśli wywołasz Challenge() bez schematu, domyślnie pójdzie na Google
    options.DefaultChallengeScheme    = GoogleDefaults.AuthenticationScheme;
  })
  // a) Cookie do przechowywania ticketu OAuth i korelacji
  .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, opts =>
  {
      opts.Cookie.SameSite     = SameSiteMode.Lax;
      opts.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
  })
  // b) JWT Bearer do zabezpieczania Twoich API
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
  // c) Google OAuth2
  .AddGoogle(GoogleDefaults.AuthenticationScheme, opts =>
  {
      opts.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
      opts.CallbackPath = "/api/auth/google-response";
      opts.ClientId     = builder.Configuration["Authentication:Google:ClientId"]!;
      opts.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;

      // korelacja/nonce też Lax, żeby działało na localhost
      opts.CorrelationCookie.SameSite = SameSiteMode.Lax;
      opts.CorrelationCookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
      // Removed NonceCookie configuration as it is not supported by GoogleOptions
  });

builder.Services.AddAuthorization();

// --- 4) Twoje serwisy i kontrolery
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddControllers();

var app = builder.Build();

// --- 5) Middleware pipeline
app.UseRouting();

// CORS **przed** auth, by preflighty przeszły
app.UseCors("AllowFrontend");

// Cookie policy – dodatkowa gwarancja SameSite/Secure
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
