
using Microsoft.Extensions.DependencyInjection;

namespace Email.Logic
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
