namespace Spectator.Logic
{
  public interface ISpectatorRepository
  {
    Task AddSpectatorAsync(AddSpectatorModel spectatorModel);
    Task<IEnumerable<GetSpectatorModel>> GetAllAsync(Guid userId);
    Task DeleteAsync(Guid userId, Guid spectatorId);
  }
}
