using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Spectator.Logic;

namespace Spectator
{
  public class FetchSpectatorsFunction(ISpectatorRepository spectatorRepository)
  {
    [Function("FetchSpectatorsFunction")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "spectators")] HttpRequest req)
    {
      var userId = "a96dcbe0-96a6-440c-8cfe-25fc0eac997c";
      var model = await spectatorRepository.GetAllAsync(Guid.Parse(userId));
      return new OkObjectResult(model);
    }
  }
}
