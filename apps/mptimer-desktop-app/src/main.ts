import SquirrelEvents from './app/events/squirrel.events';
import ElectronEvents from './app/events/electron.events';
import { app, BrowserWindow } from 'electron';
import App from './app/app';
import log from 'electron-log/main';
import * as path from 'path';

export default class Main {
  static initialize() {
    if (SquirrelEvents.handleEvents()) {
      // squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
      app.quit();
    }

    const logPath = this.getLogLocation();
    log.transports.file.resolvePathFn = () =>
      path.join(logPath, 'logs/main.log');
    Object.assign(console, log.functions);
    log.initialize();
    log.debug('App started');
    log.debug(logPath);
  }

  static bootstrapApp() {
    App.main(app, BrowserWindow);
  }

  static bootstrapAppEvents() {
    ElectronEvents.bootstrapElectronEvents();

    // initialize auto updater service
    if (!App.isDevelopmentMode()) {
      // UpdateEvents.initAutoUpdateService();
    }
  }

  static getLogLocation(): string {
    if (!app.isPackaged) {
      return __dirname.replace(/\\/g, '/');
    } else {
      return path.dirname(app.getPath('exe')).replace(/\\/g, '/');
    }
  }
}

// handle setup events as quickly as possible
Main.initialize();

// bootstrap app
Main.bootstrapApp();
Main.bootstrapAppEvents();
