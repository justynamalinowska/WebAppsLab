using Backend.Models;
using BCrypt.Net;

namespace Backend.Services;

public class UserService : IUserService
{
    private readonly List<User> _users =
    [
        new User {
            Id = 1,
            Username = "justynka",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
            Email = "test@example.com"
        }
    ];

    public User? Authenticate(string username, string password)
    {
        var user = _users.SingleOrDefault(u => u.Username == username);
        if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return null;
        return user;
    }

    public User? GetById(int id) =>
        _users.SingleOrDefault(u => u.Id == id);

    public User? GetByEmail(string email)
    => _users.SingleOrDefault(u => u.Email == email);

    public User CreateExternalUser(User ext)
    {
        ext.Id = _users.Any() ? _users.Max(u => u.Id) + 1 : 1;
        ext.Role = "guest";
        _users.Add(ext);
        return ext;
    }
}
