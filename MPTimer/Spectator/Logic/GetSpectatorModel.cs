namespace Spectator.Logic
{
  public class GetSpectatorModel
  {
    public Guid Id { get; }
    public string SpectatorEmail { get; }
    public string? SpectatorName { get; }
    public DateTimeOffset? Created { get; }

    internal GetSpectatorModel(SpectatorDao dao)
    {
      Id = Guid.Parse(dao.RowKey);
      SpectatorEmail = dao.SpectatorEmail;
      SpectatorName = dao.SpectatorName;
      Created = dao.Timestamp;
    }
  }
}
