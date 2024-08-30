import { BrowserWindow, shell, screen } from 'electron';
import { rendererAppName, rendererAppPort } from './constants';
import { environment } from '../environments/environment';
import { join } from 'path';
import { format } from 'url';
import log from 'electron-log/main';
import { EventsDbService } from '../features/events/logic/events-db.service';
import eventsEpics from '../features/events/+state/events.effects';
import setupStore from './store';
import { WorkspaceEventService } from '../features/events/logic/workspace-event.service';
import { WorkTimesService } from '../features/work-times/logic/work-times.service';
import { TrayService } from '../features/tray/tray.service';
import { EventModel } from '../features/events/models/event.model';
import { loadEvents } from '../features/events/+state';
import { DBController } from '../db/db-controller';
import { MIGRATION_LIST } from '../db/migration-list';

export default class App {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  static mainWindow: Electron.BrowserWindow;
  static application: Electron.App;
  static BrowserWindow;

  static eventsDbService: EventsDbService;
  static flagQuit = false;
  static isQuiting = false;

  public static isDevelopmentMode() {
    const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnvironment: boolean =
      parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment : !environment.production;
  }

  private static onWindowAllClosed() {
    /*if (process.platform !== 'darwin') {
      App.application.quit();
    }*/
  }

  private static onClose() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    App.mainWindow = null;
  }

  private static onRedirect(event: any, url: string) {
    if (url !== App.mainWindow.webContents.getURL()) {
      // this is a normal external redirect, open it in a new browser window
      event.preventDefault();
      shell.openExternal(url);
    }
  }

  private static onReady() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    App.setup();

    if (rendererAppName) {
      App.initMainWindow();
      App.loadMainWindow();
    }
  }

  private static async setup(): Promise<void> {
    log.debug('Start App.setup');
    try {
      App.eventsDbService = new EventsDbService();

      await DBController.initialize();
      await DBController.migrate(MIGRATION_LIST);

      log.debug('Setuping store');
      const eventEffect = eventsEpics(App.eventsDbService);
      const store = setupStore([eventEffect]);

      const workSpaceEvents = new WorkspaceEventService(store);
      const workTimeService = new WorkTimesService(store);
      const trayService = new TrayService(workTimeService);

      workSpaceEvents.init();
      trayService.init();

      await App.eventsDbService.addEvent(new EventModel('AppStarted'));
      store.dispatch(loadEvents(new Date()));
    } catch (err) {
      log.error('Error setup: ', err);
      throw err;
    }
  }

  private static async onBeforeQuit(event: { preventDefault: () => void }) {
    if (!App.flagQuit) {
      event.preventDefault();

      if (App.isQuiting) {
        return;
      }

      try {
        App.isQuiting = true;
        await App.eventsDbService.addEvent(new EventModel('AppStopped'));
      } finally {
        App.flagQuit = true;
        App.application.quit();
        log.debug('App quited');
      }
    }
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.mainWindow === null) {
      App.onReady();
    }
  }

  private static initMainWindow() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);
    const height = Math.min(720, workAreaSize.height || 720);

    // Create the browser window.
    App.mainWindow = new BrowserWindow({
      width: width,
      height: height,
      show: false,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'main.preload.js'),
      },
    });
    App.mainWindow.setMenu(null);
    App.mainWindow.center();

    // if main window is ready to show, close the splash window and show the main window
    App.mainWindow.once('ready-to-show', () => {
      // App.mainWindow.show();
    });

    // handle all external redirects in a new browser window
    // App.mainWindow.webContents.on('will-navigate', App.onRedirect);
    // App.mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    //     App.onRedirect(event, url);
    // });

    // Emitted when the window is closed.
    App.mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      App.mainWindow = null;
    });
  }

  private static loadMainWindow() {
    // load the index.html of the app.
    App.mainWindow.webContents.openDevTools();
    if (!App.application.isPackaged) {
      const url = `http://localhost:${rendererAppPort}`;
      log.debug(`Serving app from url: '${url}'`);
      App.mainWindow.loadURL(url);
    } else {
      const path = join(__dirname, '..', rendererAppName, 'browser/index.html');
      const fileUrl = format({
        pathname: path,
        protocol: 'file:',
        slashes: true,
      });
      log.debug(`Serving app from file: '${fileUrl}'`);
      App.mainWindow.loadURL(fileUrl);
    }
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for

    App.BrowserWindow = browserWindow;
    App.application = app;

    App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on('ready', App.onReady); // App is ready to load data
    App.application.on('activate', App.onActivate); // App is activated
    App.application.on('before-quit', App.onBeforeQuit);
  }
}
