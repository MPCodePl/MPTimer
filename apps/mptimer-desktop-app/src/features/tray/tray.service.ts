import { Tray, Menu, app, shell, MenuItemConstructorOptions } from 'electron';
import { WorkTimesService } from '../work-times/logic/work-times.service';
import { WorkTimesModel } from '../work-times/models/work-times.model';
import log from 'electron-log';
import { MainWindow } from '../main-window/main-window';
import { DateUtils } from 'utils';

export class TrayService {
  private readonly RUNNING_TIME_MENU_ID = 'RunningTime';
  private readonly BREAKING_TIME_MENU_ID = 'BreakingTime';
  private readonly WORK_TIME_MENU_ID = 'WorkTime';

  private menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: 'Open',
      click: () => this.mainWindow.show(),
    },
    {
      type: 'separator',
    },
    {
      label: 'Running time: -',
      id: this.RUNNING_TIME_MENU_ID,
    },
    {
      label: 'Break time: -',
      id: this.BREAKING_TIME_MENU_ID,
    },
    {
      label: 'Work time: -',
      id: this.WORK_TIME_MENU_ID,
    },
    {
      type: 'separator',
    },
    {
      label: 'Open in explorer',
      click: () => shell.openPath(__dirname),
    },
    {
      label: 'Quit',
      click: () => app.quit(),
    },
  ];
  private tray: Tray;

  constructor(
    private workTimeService: WorkTimesService,
    private mainWindow: MainWindow
  ) {}

  public init(): void {
    log.debug(`${TrayService.name}.init`);
    try {
      this.tray = new Tray(`${__dirname}/assets/tray.ico`);
      const menu = Menu.buildFromTemplate(this.menuTemplate);
      this.tray.setContextMenu(menu);

      this.workTimeService.workTimes$.subscribe((workTimes) => {
        this.updateTray(workTimes);
      });
    } catch (err) {
      log.debug(`${TrayService.name}.init - error`, JSON.stringify(err));
    }
  }

  private updateTray(workTimes: WorkTimesModel): void {
    this.menuTemplate.find(
      (m) => m.id === this.RUNNING_TIME_MENU_ID
    ).label = `Running time: ${DateUtils.formatTimeSpan(
      workTimes.runningTimeSeconds
    )}`;
    this.menuTemplate.find(
      (m) => m.id === this.BREAKING_TIME_MENU_ID
    ).label = `Break time: ${DateUtils.formatTimeSpan(
      workTimes.breakTimeSeconds
    )}`;
    this.menuTemplate.find(
      (m) => m.id === this.WORK_TIME_MENU_ID
    ).label = `Work time: ${DateUtils.formatTimeSpan(
      workTimes.workTimeSeconds
    )}`;
    const menu = Menu.buildFromTemplate(this.menuTemplate);
    this.tray.setContextMenu(menu);
    this.tray.setToolTip(this.getTooltipText(workTimes));
  }

  private getTooltipText(workTimes: WorkTimesModel): string {
    return `MPTimer

Running time: ${DateUtils.formatTimeSpan(workTimes.runningTimeSeconds)}
Break time: ${DateUtils.formatTimeSpan(workTimes.breakTimeSeconds)}
Work time: ${DateUtils.formatTimeSpan(workTimes.workTimeSeconds)}`;
  }
}
