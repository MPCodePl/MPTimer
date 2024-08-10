using Azure.Storage.Queues.Models;
using Email.Logic;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Emails
{
  public class EmailQueueFunction(ILogger<EmailQueueFunction> logger, IEmailService emailService)
  {
    private readonly ILogger<EmailQueueFunction> _logger = logger;
    private readonly IEmailService _emailService = emailService;

    [Function(nameof(EmailQueueFunction))]
    public void Run([QueueTrigger("email-queue", Connection = "ANGULAR_WEBAPP_STORAGE_CONNECTION_STRING")] QueueMessage message)
    {
      _logger.LogInformation($"C# Queue trigger function processed: {message.MessageText}");
      _emailService.SendEmail("micha.duch@gmail.com");
    }
  }
}
