using Microsoft.Extensions.DependencyInjection;

namespace Spectator.Logic
{
  public static class MyConfigServiceCollectionExtensions
  {
    public static IServiceCollection AddSpectatorFeatureGroup(this IServiceCollection services)
    {
      services.AddScoped<ISpectatorRepository, SpectatorRepository>();

      return services;
    }
  }
}
