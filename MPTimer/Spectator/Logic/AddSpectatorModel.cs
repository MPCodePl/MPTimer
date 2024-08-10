using System.Text.Json.Serialization;

namespace Spectator.Logic
{
  public class AddSpectatorModel
  {
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string AccessToken { get; private set; }
    public string SpectatorEmail { get; private set; }
    public string? SpectatorName { get; private set; }
    public DateTimeOffset Created { get; private set; }

    public AddSpectatorModel(
      Guid userId,
      string spectatorEmail,
      string? spectatorName,
      string accessToken,
      Guid? id = null,
      DateTimeOffset? created = null)
    {
      UserId = userId;
      SpectatorEmail = spectatorEmail;
      SpectatorName = spectatorName;
      AccessToken = accessToken;
      Id = id ?? Guid.NewGuid();
      Created = created ?? DateTimeOffset.Now;
    }

    [JsonConstructor]
    public AddSpectatorModel(
      Guid userId,
      string spectatorEmail,
      string? spectatorName,
      string accessToken,
      Guid id,
      DateTimeOffset created)
    {
      Id = id;
      UserId = userId;
      SpectatorEmail = spectatorEmail;
      SpectatorName = spectatorName;
      AccessToken = accessToken;
      Created = created;
    }

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
