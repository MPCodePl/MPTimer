namespace EmailFeature
{
  public interface IEmailService
  {
    Task SendEmail(string to);
  }
}
