namespace Email.Logic
{
  public class EmailConfiguration(string apiKey, string apiSecret)
  {
    public string ApiKey { get; set; } = apiKey;
    public string ApiSecret { get; set; } = apiSecret;
  }
}
