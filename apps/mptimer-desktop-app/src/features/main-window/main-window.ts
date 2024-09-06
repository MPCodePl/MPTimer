import { BrowserWindow, dialog, screen } from 'electron';
import log from 'electron-log';
import { join } from 'path';
import { rendererAppName, rendererAppPort } from '../../app/constants';
import { format } from 'url';
import { ipcMain } from 'electron/main';
import { WorkTimesService } from '../work-times/logic/work-times.service';
import { EventModel } from 'event-models';
import { Store } from 'redux';
import { RepositoryModel } from 'repository-models';
import { addRepository, removeRepository } from '../repositories/+state';
import { RepositoryService } from '../repositories/logic/repository.service';

export class MainWindow {
  constructor(
    private isPackaged: boolean,
    private workTimesService: WorkTimesService,
    private repositoryService: RepositoryService,
    private store: Store
  ) {}

  private mainWindow: Electron.BrowserWindow;
  private events: EventModel[];
  private repositories: RepositoryModel[];

  public init(): void {
    ipcMain.handle('eventsInit', (event) => {
      return this.events;
    });

    ipcMain.handle('repositoryInit', (event) => {
      return this.repositories;
    });

    ipcMain.on('removeRepository', (event, { repositoryId }) => {
      this.store.dispatch(removeRepository({ repositoryId }));
    });

    ipcMain.on('addRepository', async (event) => {
      log.debug('addRepository - start');
      const file = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openDirectory'],
      });
      if (file.canceled) {
        log.debug('addRepository - dialog cancelled');
        return;
      }

      const path = file.filePaths[0];
      log.debug(`addRepository - selected path "${path}"`);
      const pathSplitted = path.split('\\');
      const repositoryName = pathSplitted[pathSplitted.length - 1];
      const repository = new RepositoryModel(repositoryName, path, new Date());
      this.store.dispatch(addRepository({ repository }));
    });

    this.workTimesService.allEvents$.subscribe((events) => {
      this.events = events;
      if (this.mainWindow == null) {
        return;
      }

      this.mainWindow.webContents.send('eventsUpdated', events);
    });

    this.repositoryService.allRepositories$.subscribe((repositories) => {
      this.repositories = repositories;
      if (this.mainWindow == null) {
        return;
      }

      this.mainWindow.webContents.send('repositoriesUpdated', repositories);
    });
  }

  public show(): void {
    log.debug(`${MainWindow.name}.show - start`);
    if (this.mainWindow == null) {
      log.debug(`${MainWindow.name}.show - no window. Creating new instance.`);
      this.initMainWindow();
      this.loadMainWindow();
    } else {
      log.debug(
        `${MainWindow.name}.show - window is created. Focusing current one.`
      );
      this.mainWindow.focus();
    }
  }

  private initMainWindow() {
    try {
      const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
      const width = Math.min(1280, workAreaSize.width || 1280);
      const height = Math.min(720, workAreaSize.height || 720);

      // Create the browser window.
      this.mainWindow = new BrowserWindow({
        width: width,
        height: height,
        show: false,
        webPreferences: {
          contextIsolation: true,
          backgroundThrottling: false,
          preload: join(__dirname, 'main.preload.js'),
        },
      });

      this.mainWindow.setMenu(null);
      this.mainWindow.center();

      // if main window is ready to show, close the splash window and show the main window
      this.mainWindow.once('ready-to-show', () => {
        log.debug(`${MainWindow.name}.initMainWindow ready-to-show`);
        this.mainWindow.show();
      });

      // handle all external redirects in a new browser window
      // App.mainWindow.webContents.on('will-navigate', App.onRedirect);
      // App.mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
      //     App.onRedirect(event, url);
      // });

      // Emitted when the window is closed.
      this.mainWindow.on('closed', () => {
        log.debug(`${MainWindow.name}.initMainWindow closed`);
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        this.mainWindow = null;
      });
    } catch (err) {
      log.error(`${MainWindow.name}.initMainWindow error`, err);
    }
  }

  private loadMainWindow() {
    // load the index.html of the app.
    this.mainWindow.webContents.openDevTools();
    if (!this.isPackaged) {
      const url = `http://localhost:${rendererAppPort}`;
      log.debug(`Serving app from url: '${url}'`);
      this.mainWindow.loadURL(url);
    } else {
      const path = join(__dirname, '..', rendererAppName, 'browser/index.html');
      const fileUrl = format({
        pathname: path,
        protocol: 'file:',
        slashes: true,
      });
      log.debug(`Serving app from file: '${fileUrl}'`);
      this.mainWindow.loadURL(fileUrl);
    }
  }
}
