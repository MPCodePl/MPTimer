import { contextBridge, ipcRenderer } from 'electron';
import { EventModel } from 'event-models';
import { RepositoryModel } from 'repository-models';

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  eventsInit: () => ipcRenderer.invoke('eventsInit'),
  onEventsUpdated: (callback: (events: EventModel) => void) =>
    ipcRenderer.on('eventsUpdated', (_event, value) => callback(value)),
  repositoryInit: () => ipcRenderer.invoke('repositoryInit'),
  addRepository: () => ipcRenderer.send('addRepository'),
  removeRepository: (args: { repositoryId: string }) =>
    ipcRenderer.send('removeRepository', args),
  onRepositoriesUpdated: (callback: (events: RepositoryModel) => void) =>
    ipcRenderer.on('repositoriesUpdated', (_event, value) => callback(value)),
  platform: process.platform,
});
