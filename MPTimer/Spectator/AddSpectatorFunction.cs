using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Spectator
{
  public class AddSpectatorFunction
  {
    private readonly ILogger<AddSpectatorFunction> _logger;

    public AddSpectatorFunction(ILogger<AddSpectatorFunction> logger)
    {
      _logger = logger;
    }

    [Function("AddSpectator")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "spectator")] HttpRequest req)
    {
      _logger.LogInformation("C# HTTP trigger function processed a request.");
      return new OkObjectResult("Welcome to Azure Functions!");
    }
  }
}
