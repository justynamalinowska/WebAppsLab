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
        return Ok(new UserDto { Id = u.Id, Username = u.Username, Email = u.Email });
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

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout([FromBody] LogoutRequest req)
    {
    _refreshTokens.Remove(req.RefreshToken);
    return NoContent();
    }
}
