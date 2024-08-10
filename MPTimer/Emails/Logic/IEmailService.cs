namespace Email.Logic
{
  public interface IEmailService
  {
    Task SendEmail(string to);
  }
}
