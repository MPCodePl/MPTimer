using EmailsApi;
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;

namespace Email.Logic
{
  public class EmailService : IEmailService
  {
    private readonly MailjetClient _client = new(Environment.GetEnvironmentVariable("MailJet_ApiKey"), Environment.GetEnvironmentVariable("MailJet_SecretKey"));
    private readonly string FROM = Environment.GetEnvironmentVariable("MailJet_From") ?? throw new Exception("MailJet_From configuration is missing");
    private readonly string FROM_NAME = Environment.GetEnvironmentVariable("MailJet_FromName") ?? throw new Exception("MailJet_FromName configuration is missing");

    public EmailService()
    {
    }

    public async Task SendEmail(EmailModel email)
    {
      // construct your email with builder
      var emailToSend = new TransactionalEmailBuilder()
             .WithFrom(new SendContact(FROM, FROM_NAME))
             .WithSubject(email.Subject)
             .WithHtmlPart(email.Body)
             .WithTo(new SendContact(email.To))
             .Build();

      // invoke API to send email
      await _client.SendTransactionalEmailAsync(emailToSend);
    }
  }
}
