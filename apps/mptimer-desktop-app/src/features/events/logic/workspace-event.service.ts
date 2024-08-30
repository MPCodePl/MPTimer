import { powerMonitor } from 'electron';
import { EventModel } from '../models/event.model';
import { Store } from 'redux';
import { addEvent } from '../+state';
import { interval } from 'rxjs';
import log from 'electron-log';

export class WorkspaceEventService {
  private idle: boolean;
  private IDLE_THRESHOLD_IN_SECONDS = 5;

  constructor(private store: Store) {}

  public init(): void {
    log.debug(`${WorkspaceEventService.name}.init - start`);
    try {
      powerMonitor.addListener('lock-screen', () => {
        this.store.dispatch(addEvent(new EventModel('UserLock')));
      });

      powerMonitor.addListener('unlock-screen', () => {
        this.store.dispatch(addEvent(new EventModel('UserUnlock')));
      });

      interval(1000).subscribe(() => {
        const idleTime = powerMonitor.getSystemIdleTime();
        if (idleTime > this.IDLE_THRESHOLD_IN_SECONDS && !this.idle) {
          this.idle = true;
          this.store.dispatch(addEvent(new EventModel('UserIdle')));
        } else if (idleTime < this.IDLE_THRESHOLD_IN_SECONDS && this.idle) {
          this.idle = false;
          this.store.dispatch(addEvent(new EventModel('UserUnIdle')));
        }
      });
    } catch (err) {
      log.error(
        `${WorkspaceEventService.name}.init - error`,
        JSON.stringify(err)
      );
      throw err;
    }
  }
}
