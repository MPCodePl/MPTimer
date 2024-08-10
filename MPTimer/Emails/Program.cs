using Email.Logic;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(builder =>
    {
      builder.AddEmailFeatureGroup();
    })
    .Build();

host.Run();
