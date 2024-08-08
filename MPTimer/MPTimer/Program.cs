using Microsoft.Extensions.Hosting;
using EmailFeature;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(builder =>
    {
      builder.AddEmailFeatureGroup();
    })
    .Build();

host.Run();
