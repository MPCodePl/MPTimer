using Azure.Storage.Queues.Models;
using EmailFeature;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace MPTimer
{
  public class EmailQueueFunction
  {
    private readonly ILogger<EmailQueueFunction> _logger;
    private readonly IEmailService _emailService;

    public EmailQueueFunction(ILogger<EmailQueueFunction> logger, IEmailService emailService)
    {
      _logger = logger;
      _emailService = emailService;
    }

    [Function(nameof(EmailQueueFunction))]
    public void Run([QueueTrigger("email-queue", Connection = "ANGULAR_WEBAPP_STORAGE_CONNECTION_STRING")] QueueMessage message)
    {
      _logger.LogInformation($"C# Queue trigger function processed: {message.MessageText}");
      _emailService.SendEmail("micha.duch@gmail.com");
    }
  }
}
