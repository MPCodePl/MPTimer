using Azure;
using Azure.Data.Tables;

namespace Spectator.Logic
{
  internal class SpectatorDao : ITableEntity
  {
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string AccessToken { get; set; }
    public string SpectatorEmail { get; set; }
    public string? SpectatorName { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public SpectatorDao()
    {
      PartitionKey = "";
      RowKey = "";
      AccessToken = "";
      SpectatorEmail = "";
    }
  }
}
