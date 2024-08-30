import { Tray, Menu, app, shell, MenuItemConstructorOptions } from 'electron';
import { WorkTimesService } from '../work-times/logic/work-times.service';
import { DateUtils } from '../utils/date.utils';
import { WorkTimesModel } from '../work-times/models/work-times.model';
import log from 'electron-log';

export class TrayService {
  private menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: 'Running time: -',
    },
    {
      label: 'Break time: -',
    },
    {
      label: 'Work time: -',
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

  constructor(private workTimeService: WorkTimesService) {}

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
    this.menuTemplate[0].label = `Running time: ${DateUtils.formatTimeSpan(
      workTimes.runningTimeSeconds
    )}`;
    this.menuTemplate[1].label = `Break time: ${DateUtils.formatTimeSpan(
      workTimes.breakTimeSeconds
    )}`;
    this.menuTemplate[2].label = `Work time: ${DateUtils.formatTimeSpan(
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
