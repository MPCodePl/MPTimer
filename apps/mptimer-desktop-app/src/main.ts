import SquirrelEvents from './app/events/squirrel.events';
import ElectronEvents from './app/events/electron.events';
import { app, BrowserWindow } from 'electron';
import App from './app/app';
import log from 'electron-log/main';
import * as path from 'path';
import { resolve } from 'path';
import { DB } from './db/db';

export default class Main {
  static async initialize() {
    if (SquirrelEvents.handleEvents()) {
      // squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
      app.quit();
    }

    const mainPath = this.geMainPath();
    log.transports.file.resolvePathFn = () =>
      path.join(mainPath, `logs/${new Date().toISOString().split('T')[0]}.log`);
    Object.assign(console, log.functions);
    log.initialize();
    log.debug('App started');
    log.debug(mainPath);
    const dbPath = resolve(mainPath, 'mptimer.db');
    DB.initialize(dbPath);
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

  static geMainPath(): string {
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
