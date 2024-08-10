using Azure.Storage.Queues;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Spectator.Logic;
using System.Text.Json;
using FromBodyAttribute = Microsoft.Azure.Functions.Worker.Http.FromBodyAttribute;

namespace Spectator
{
  public class AddSpectatorFunction(IConfiguration configuration, ISpectatorRepository spectatorRepository)
  {
    private readonly JsonSerializerOptions SerializeOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    private readonly IConfiguration _configuration = configuration;

    [Function("AddSpectatorFunction")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "spectator")] HttpRequest req, [FromBody] CreateSpectatorDto createSpectatorDto)
    {
      // Tworzenie referencji do kolejki
      string connectionString = _configuration.GetConnectionString("SPECTATOR_CONTEXT_CONNECTION_STRING") ?? throw new Exception("Configuration is required");
      string queueName = "spectator-created-queue";  // Zamień na nazwę swojej kolejki
      QueueClient queueClient = new(connectionString, queueName, new QueueClientOptions
      {
        MessageEncoding = QueueMessageEncoding.Base64,
      });
      var uniqueAccessToken = Guid.NewGuid();
      var userId = "a96dcbe0-96a6-440c-8cfe-25fc0eac997c";
      var model = new AddSpectatorModel(
        Guid.Parse(userId),
        createSpectatorDto.SpectatorEmail,
        createSpectatorDto.SpectatorName,
        uniqueAccessToken.ToString());
      await spectatorRepository.AddSpectatorAsync(model);
      // Sprawdzenie, czy kolejka istnieje, jeśli nie - tworzenie jej
      await queueClient.CreateIfNotExistsAsync();
      if (queueClient.Exists())
      {
        // Wysyłanie wiadomości do kolejki

        var modelAsJson = JsonSerializer.Serialize(model, SerializeOptions);
        await queueClient.SendMessageAsync(modelAsJson);
      }
      else
      {
        return new BadRequestObjectResult("Nie można znaleźć kolejki.");
      }

      return new CreatedResult();
    }
  }
}
