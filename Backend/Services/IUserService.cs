using Backend.Models;

namespace Backend.Services;
public interface IUserService
{
    User? Authenticate(string username, string password);
    User? GetById(int id);
    User? GetByEmail(string email);
    User  CreateExternalUser(User user);
}