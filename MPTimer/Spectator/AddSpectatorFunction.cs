using Azure.Storage.Queues;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Spectator.Logic;

namespace Spectator
{
  public class AddSpectatorFunction(IConfiguration configuration, ISpectatorRepository spectatorRepository)
  {
    private readonly IConfiguration _configuration = configuration;

    [Function("AddSpectatorFunction")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "spectator")] HttpRequest req)
    {
      // Tworzenie referencji do kolejki
      string connectionString = _configuration.GetConnectionString("ANGULAR_WEBAPP_STORAGE_CONNECTION_STRING") ?? throw new Exception("Configuration is required");
      string queueName = "spectator-created-queue";  // Zamień na nazwę swojej kolejki
      QueueClient queueClient = new(connectionString, queueName);
      var model = new AddSpectatorModel(Guid.NewGuid(), "micha.duch@gmail.com", "Michał Paduch", "uniqueAccessToken");
      await spectatorRepository.AddSpectatorAsync(model);
      // Sprawdzenie, czy kolejka istnieje, jeśli nie - tworzenie jej
      await queueClient.CreateIfNotExistsAsync();
      if (queueClient.Exists())
      {
        // Wysyłanie wiadomości do kolejki
        await queueClient.SendMessageAsync("test");
      }
      else
      {
        return new BadRequestObjectResult("Nie można znaleźć kolejki.");
      }

      return new CreatedResult();

    }
  }
}
