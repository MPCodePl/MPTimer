import { contextBridge, ipcRenderer } from 'electron';
import { EventModel } from '../../features/events/models/event.model';

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  eventsInit: () => ipcRenderer.invoke('eventsInit'),
  onEventsUpdated: (callback: (events: EventModel) => void) =>
    ipcRenderer.on('eventsUpdated', (_event, value) => callback(value)),
  platform: process.platform,
});
