
using Microsoft.Extensions.DependencyInjection;

namespace EmailFeature
{
  public static class MyConfigServiceCollectionExtensions
  {
    public static IServiceCollection AddEmailFeatureGroup(this IServiceCollection services)
    {
      services.AddScoped<IEmailService, EmailService>();

      return services;
    }
  }
}
