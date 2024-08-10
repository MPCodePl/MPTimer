using Microsoft.Extensions.DependencyInjection;

namespace EmailsApi
{
  public static class EmailsApiDependencyInjection
  {
    public static IServiceCollection AddEmailApiGroup(this IServiceCollection services)
    {
      services.AddScoped<IEmailsQueue, EmailsQueue>();

      return services;
    }
  }
}
