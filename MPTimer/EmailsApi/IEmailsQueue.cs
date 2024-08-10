
namespace EmailsApi
{
  public interface IEmailsQueue
  {
    Task Push(EmailModel model);
  }
}