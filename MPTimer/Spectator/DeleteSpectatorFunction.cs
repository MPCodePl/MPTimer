using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Spectator.Logic;

namespace Spectator
{
  public class DeleteSpectatorFunction(ISpectatorRepository spectatorRepository)
  {
    [Function("DeleteSpectatorFunction")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "spectator/{spectatorId}")] HttpRequest req, string spectatorId)
    {
      var userId = "a96dcbe0-96a6-440c-8cfe-25fc0eac997c";
      await spectatorRepository.DeleteAsync(Guid.Parse(userId), Guid.Parse(spectatorId));
      return new OkResult();
    }
  }
}
