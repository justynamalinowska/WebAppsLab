using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DTO;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly JwtSettings _jwtSettings;
    // prosta pamięć na refresh tokeny:
    private static readonly Dictionary<string, int> _refreshTokens = new();

    public AuthController(IUserService userService, IOptions<JwtSettings> opt)
    {
        _userService = userService;
        _jwtSettings = opt.Value;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest req)
    {
        var user = _userService.Authenticate(req.Username, req.Password);
        if (user is null) return Unauthorized("Nieprawidłowy login lub hasło");

        var token = GenerateJwt(user);
        var refreshToken = Guid.NewGuid().ToString();
        _refreshTokens[refreshToken] = user.Id;

        return Ok(new LoginResponse { Token = token, RefreshToken = refreshToken });
    }

    [HttpPost("refresh")]
    public ActionResult<LoginResponse> Refresh([FromBody] RefreshRequest req)
    {
        if (!_refreshTokens.TryGetValue(req.RefreshToken, out var userId))
            return BadRequest("Błędny refresh token");

        var user = _userService.GetById(userId)!;
        var newToken = GenerateJwt(user);
        var newRefresh = Guid.NewGuid().ToString();

        // wymień
        _refreshTokens.Remove(req.RefreshToken);
        _refreshTokens[newRefresh] = userId;

        return Ok(new LoginResponse { Token = newToken, RefreshToken = newRefresh });
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<UserDto> Me()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var u = _userService.GetById(id)!;
        return Ok(new UserDto { Id = u.Id, Username = u.Username, Email = u.Email, Role = u.Role });
    }

    private string GenerateJwt(User user)
    {
        var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            }),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                                                        SecurityAlgorithms.HmacSha256Signature)
        };
        return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
    }

    [AllowAnonymous]
    [HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var props = new AuthenticationProperties
        {
            RedirectUri = Url.Action("GoogleResponse", "Auth") // np. /api/auth/google-response
        };
        return Challenge(props, GoogleDefaults.AuthenticationScheme);
    }

    [AllowAnonymous]
    [HttpGet("google-response")]
    public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
        if (!result.Succeeded) return BadRequest("Google authentication failed");

        // wyciągamy dane z tokena Google
        var claims = result.Principal!.Claims;
        var email  = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value!;
        var name   = claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value ?? "";
        var surname= claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value ?? "";

        // sprawdź, czy mamy w lokalnej bazie
        var user = _userService.GetByEmail(email)
               ?? _userService.CreateExternalUser(new User {
                    Email     = email,
                    FirstName = name,
                    LastName  = surname,
                    Username  = email,
                    PasswordHash = null    // bo OAuth
                 });

        // wygeneruj JWT z rolą
        var token = GenerateJwt(user);

        // zwróć do frontu (możesz przekierować do Vite z query)
        return Ok(new {
            Token = token,
            Role  = user.Role
        });
    }

    [HttpPost("logout")]
     public IActionResult Logout([FromBody] LogoutRequest req)
        {
            if (_refreshTokens.ContainsKey(req.RefreshToken))
                _refreshTokens.Remove(req.RefreshToken);
            return NoContent();  
        }
}
