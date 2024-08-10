using Azure.Data.Tables;
using Microsoft.Extensions.Configuration;

namespace Spectator.Logic
{
  internal class SpectatorRepository(IConfiguration configuration) : ISpectatorRepository
  {
    private readonly IConfiguration _configuration = configuration;

    public async Task AddSpectatorAsync(AddSpectatorModel spectatorModel)
    {
      string connectionString = _configuration.GetConnectionString("ANGULAR_WEBAPP_STORAGE_CONNECTION_STRING") ?? throw new Exception("Configuration is required");
      var serviceClient = new TableServiceClient(connectionString);
      var tableClient = serviceClient.GetTableClient("Spectators");
      var dao = spectatorModel.CreateDao();
      await tableClient.AddEntityAsync(dao);
    }

    public async Task<IEnumerable<GetSpectatorModel>> GetAllAsync(Guid userId)
    {
      string connectionString = _configuration.GetConnectionString("ANGULAR_WEBAPP_STORAGE_CONNECTION_STRING") ?? throw new Exception("Configuration is required");
      var serviceClient = new TableServiceClient(connectionString);
      var tableClient = serviceClient.GetTableClient("Spectators");
      var pageable = tableClient.QueryAsync<SpectatorDao>(filter: $"PartitionKey eq '{userId}'");
      var pages = new List<GetSpectatorModel>();
      await foreach (var dao in pageable)
      {
        pages.Add(new GetSpectatorModel(dao));
      }

      return pages;
    }

    public async Task DeleteAsync(Guid userId, Guid spectatorId)
    {
      string connectionString = _configuration.GetConnectionString("ANGULAR_WEBAPP_STORAGE_CONNECTION_STRING") ?? throw new Exception("Configuration is required");
      var serviceClient = new TableServiceClient(connectionString);
      var tableClient = serviceClient.GetTableClient("Spectators");
      await tableClient.DeleteEntityAsync(userId.ToString(), spectatorId.ToString());
    }
  }
}
