namespace Spectator.Logic
{
  public class AddSpectatorModel(
    Guid userId,
    string spectatorEmail,
    string? spectatorName,
    string accessToken,
    Guid? id = null,
    DateTimeOffset? created = null)
  {
    public Guid Id { get; } = id ?? Guid.NewGuid();
    public Guid UserId { get; } = userId;
    public string AccessToken { get; } = accessToken;
    public string SpectatorEmail { get; } = spectatorEmail;
    public string? SpectatorName { get; } = spectatorName;
    public DateTimeOffset Created { get; } = created ?? DateTimeOffset.Now;

    internal SpectatorDao CreateDao()
    {
      return new SpectatorDao()
      {
        PartitionKey = UserId.ToString(),
        RowKey = Id.ToString(),
        AccessToken = AccessToken,
        SpectatorEmail = SpectatorEmail,
        SpectatorName = SpectatorName,
        Timestamp = Created,
      };
    }
  }
}
