namespace EmailsApi
{
  public class EmailModel(string to, string subject, string body)
  {
    public string To { get; } = to;
    public string Subject { get; } = subject;
    public string Body { get; } = body;
  }
}
