using Azure.Storage.Queues.Models;
using EmailsApi;
using Microsoft.Azure.Functions.Worker;
using Spectator.Logic;
using System.Text.Json;

namespace Spectator
{
  public class SendCreateSpectatorEmailFunction(IEmailsQueue emailsQueue)
  {
    [Function(nameof(SendCreateSpectatorEmailFunction))]
    public void Run([QueueTrigger("spectator-created-queue", Connection = "SPECTATOR_CONTEXT_CONNECTION_STRING")] AddSpectatorModel message)
    {
      var email = CreateEmail(message);
      emailsQueue.Push(email);
    }

    private static EmailModel CreateEmail(AddSpectatorModel spectatorCreateModel) => new(spectatorCreateModel.SpectatorEmail, "Someone shared worktime with you", $"<h1>Hey, someone has shared his worktime with you.</h1> " +
        $"<p>You can see worktime by entering <a href=\"spectator.mptimer.net/${spectatorCreateModel.AccessToken}\">Link</a>. Everyone with this link can see worktime.</p> <p>Please do not reply on this email</p><p>Regards</p><p>MPTimer team</p>");
  }
}
