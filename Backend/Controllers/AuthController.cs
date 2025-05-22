using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Models;
using Backend.Services;
using DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly JwtSettings _jwtSettings;
    private static readonly Dictionary<string, int> _refreshTokens = new();

    public AuthController(IUserService userService, IOptions<JwtSettings> opts)
    {
        _userService  = userService;
        _jwtSettings = opts.Value;
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest req)
    {
        var user = _userService.Authenticate(req.Username, req.Password);
        if (user is null) return Unauthorized("Nieprawidłowy login lub hasło");

        var token = GenerateJwt(user);
        var refresh = Guid.NewGuid().ToString();
        _refreshTokens[refresh] = user.Id;

        return Ok(new LoginResponse { Token = token, RefreshToken = refresh });
    }

    [HttpPost("refresh")]
    public ActionResult<LoginResponse> Refresh([FromBody] RefreshRequest req)
    {
        if (!_refreshTokens.TryGetValue(req.RefreshToken!, out var userId))
            return BadRequest("Błędny refresh token");

        var user = _userService.GetById(userId)!;
        var newToken = GenerateJwt(user);
        var newRefresh = Guid.NewGuid().ToString();

        _refreshTokens.Remove(req.RefreshToken!);
        _refreshTokens[newRefresh] = userId;

        return Ok(new LoginResponse { Token = newToken, RefreshToken = newRefresh });
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("me")]
    public ActionResult<UserDto> Me()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var u = _userService.GetById(id)!;
        return Ok(new UserDto { Id = u.Id, Username = u.Username, Email = u.Email, Role = u.Role });
    }

    [HttpPost("logout")]
    public IActionResult Logout([FromBody] LogoutRequest req)
    {
        if (_refreshTokens.ContainsKey(req.RefreshToken!))
            _refreshTokens.Remove(req.RefreshToken!);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var props = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleResponse), "Auth")
        };
        return Challenge(props, GoogleDefaults.AuthenticationScheme);
    }

    [AllowAnonymous]
    [HttpGet("google-response")]
    public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!result.Succeeded)
            return BadRequest("Google authentication failed");

        var claims  = result.Principal!.Claims;
        var email   = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value!;
        var name    = claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value  ?? "";
        var surname = claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value    ?? "";

        var user = _userService.GetByEmail(email)
                   ?? _userService.CreateExternalUser(new User {
                       Email       = email,
                       FirstName   = name,
                       LastName    = surname,
                       Username    = email,
                       PasswordHash= null
                   });

        var jwt = GenerateJwt(user);

        var frontendUrl = $"http://localhost:5173?token={jwt}&role={user.Role}";
        return Redirect(frontendUrl);
    }

    private string GenerateJwt(User user)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);
        var handler = new JwtSecurityTokenHandler();
        var desc = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email ?? "")
            }),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(keyBytes),
                SecurityAlgorithms.HmacSha256
            )
        };
        return handler.WriteToken(handler.CreateToken(desc));
    }
}
