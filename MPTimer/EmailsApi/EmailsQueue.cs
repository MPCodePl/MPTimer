using Azure.Storage.Queues;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace EmailsApi
{
  public class EmailsQueue(IConfiguration configuration) : IEmailsQueue
  {
    public async Task Push(EmailModel model)
    {
      string connectionString = configuration.GetConnectionString("EMAIL_CONTEXT_CONNECTION_STRING") ?? throw new Exception("Configuration is required");
      string queueName = "email-queue";  // Zamień na nazwę swojej kolejki
      QueueClient queueClient = new(connectionString, queueName, new QueueClientOptions()
      {
        MessageEncoding = QueueMessageEncoding.Base64,
      });
      await queueClient.CreateIfNotExistsAsync();
      if (queueClient.Exists())
      {
        var messageAsJson = JsonSerializer.Serialize(model);
        await queueClient.SendMessageAsync(messageAsJson);
      }
      else
      {
        throw new Exception($"Queue with name {queueName} not found");
      }
    }
  }
}
