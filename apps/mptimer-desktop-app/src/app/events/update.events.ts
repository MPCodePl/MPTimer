import { app, dialog, MessageBoxOptions } from 'electron';
import { autoUpdater } from 'electron-updater';
import App from '../app';
import * as log from 'electron-log';

autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on('checking-for-update', () => {
  log.debug(`${UpdateEvents.name} on checking-for-update`);
});

autoUpdater.on('download-progress', (progress) => {
  log.debug(`${UpdateEvents.name} on download-progress ${progress.percent}%`);
});

autoUpdater.on('error', (error) => {
  log.debug(`${UpdateEvents.name} on error`, error);
});

autoUpdater.on('login', (info) => {
  log.debug(`${UpdateEvents.name} on login`, info);
});

autoUpdater.on('update-available', (update) => {
  log.debug(`${UpdateEvents.name} on update-available`, update);
});

autoUpdater.on('update-cancelled', (update) => {
  log.debug(`${UpdateEvents.name} on update-cancelled`, update);
});

autoUpdater.on('update-downloaded', (update) => {
  log.debug(`${UpdateEvents.name} on update-downloaded`, update);
});

autoUpdater.on('update-not-available', (update) => {
  log.debug(
    `${UpdateEvents.name} on update-not-availableupdate-available`,
    update
  );
});

export default class UpdateEvents {
  // initialize auto update service - most be invoked only in production
  static initAutoUpdateService() {
    log.debug('initAutoUpdateService - start');

    autoUpdater.checkForUpdatesAndNotify();

    /*const platform_arch =
      platform() === 'win32' ? platform() : platform() + '_' + arch();
    const version = app.getVersion();
    const feed: Electron.FeedURLOptions = {
      url: `${updateServerUrl}/update/${platform_arch}/${version}`,
    };

    if (!App.isDevelopmentMode()) {
      log.debug('Initializing auto update service...');
    }*/
  }

  // check for updates - most be invoked after initAutoUpdateService() and only in production
  static checkForUpdates() {
    if (app.isPackaged && autoUpdater.getFeedURL() !== '') {
      autoUpdater.checkForUpdates();
    }
  }
}
