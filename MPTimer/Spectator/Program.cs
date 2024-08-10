using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Spectator.Logic;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
      services.AddApplicationInsightsTelemetryWorkerService();
      services.ConfigureFunctionsApplicationInsights();
      services.AddSpectatorFeatureGroup();
    })
    .Build();

host.Run();
