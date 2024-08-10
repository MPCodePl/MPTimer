using EmailsApi;

namespace Email.Logic
{
  public interface IEmailService
  {
    Task SendEmail(EmailModel email);
  }
}
