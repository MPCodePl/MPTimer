using Mailjet.Client;
using Mailjet.Client.Resources;
using Mailjet.Client.TransactionalEmails;

namespace EmailFeature
{
  public class EmailService : IEmailService
  {
    private readonly MailjetClient _client = new(Environment.GetEnvironmentVariable("MailJet_ApiKey"), Environment.GetEnvironmentVariable("MailJet_SecretKey"));
    private readonly string FROM = Environment.GetEnvironmentVariable("MailJet_From") ?? throw new Exception("MailJet_From configuration is missing");
    private readonly string FROM_NAME = Environment.GetEnvironmentVariable("MailJet_FromName") ?? throw new Exception("MailJet_FromName configuration is missing");

    public EmailService()
    {
    }

    public async Task SendEmail(string to)
    {
      MailjetRequest request = new()
      {
        Resource = Send.Resource
      };

      // construct your email with builder
      var email = new TransactionalEmailBuilder()
             .WithFrom(new SendContact(FROM, FROM_NAME))
             .WithSubject("Test subject")
             .WithHtmlPart("<h1>Header</h1>")
             .WithTo(new SendContact(to))
             .Build();

      // invoke API to send email
      await _client.SendTransactionalEmailAsync(email);
    }
  }
}
