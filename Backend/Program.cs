using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;
using Backend.Services; 

var builder = WebApplication.CreateBuilder(args);

// 0) Ustaw adres hosta (opcjonalnie)
builder.WebHost.UseUrls("http://localhost:5000");

// 1) CORS – zezwalamy na zapytania z frontendu
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // adres Twojego frontendu
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// 2) Wczytanie konfiguracji JwtSettings z appsettings.json
var jwtSection = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSection);
var jwtSettings = jwtSection.Get<JwtSettings>()!;
var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

// 3) Authentication + Authorization
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = GoogleDefaults.AuthenticationScheme;
    options.DefaultSignInScheme       = CookieAuthenticationDefaults.AuthenticationScheme;
})
// cookies do przechwytywania ticketu z Google
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.Cookie.SameSite    = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
})
// JWT Bearer
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken            = true;
    options.TokenValidationParameters = new TokenValidationParameters
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
// Google OAuth
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.CallbackPath = "/api/auth/google-response";
    options.ClientId     = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
});

builder.Services.AddAuthorization();

// 4) Rejestracja serwisów aplikacyjnych
builder.Services.AddScoped<IUserService, UserService>();

// 5) Kontrolery
builder.Services.AddControllers();

var app = builder.Build();

// 6) Pipeline
app.UseCors("AllowFrontend");
app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
