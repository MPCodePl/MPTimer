namespace EmailFeature
{
  public class EmailConfiguration
  {
    public EmailConfiguration(string apiKey, string apiSecret)
    {
      ApiKey = apiKey;
      ApiSecret = apiSecret;
    }

    public string ApiKey { get; set; }
    public string ApiSecret { get; set; }
  }
}
