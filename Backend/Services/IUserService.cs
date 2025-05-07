using Backend.Models;

namespace Backend.Services;
public interface IUserService
{
    User? Authenticate(string username, string password);
    User? GetById(int id);
}