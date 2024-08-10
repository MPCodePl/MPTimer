namespace Spectator.Logic
{
  public class CreateSpectatorDto(string id, string spectatorEmail, string spectatorName)
  {
    public string Id { get; } = id;
    public string SpectatorEmail { get; } = spectatorEmail;
    public string SpectatorName { get; } = spectatorName;
  }
}
