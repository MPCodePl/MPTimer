import { EventModel } from 'event-models';
import { WorkTimesModel } from './work-times.model';

export class EventLogic {
  public countWorkTimes(events: EventModel[]): WorkTimesModel {
    let runningTime = 0;
    let breakTime = 0;
    let previousRun: number | null = null;
    let previousLock: number | null = null;

    for (const event of events) {
      const eventTimeSpan = this.getTimeSpanInSecond(event.date);
      if (event.type === 'AppStarted') {
        previousRun = previousRun ?? eventTimeSpan;
      }

      if (event.type === 'UserLock') {
        previousLock = previousLock ?? eventTimeSpan;
      }

      if (event.type === 'UserUnlock') {
        previousRun = previousRun ?? eventTimeSpan;
        if (previousLock != null) {
          breakTime += eventTimeSpan - previousLock;
          previousLock = null;
        }
      }

      if (event.type === 'AppStopped') {
        if (previousRun != null) {
          runningTime += eventTimeSpan - previousRun;
          previousRun = null;
        }

        if (previousLock != null) {
          breakTime += eventTimeSpan - previousLock;
          previousLock = null;
        }
      }
    }

    if (previousRun != null) {
      runningTime +=
        previousLock ?? this.getTimeSpanInSecond(new Date()) - previousRun;
    }

    if (previousLock != null) {
      breakTime += this.getTimeSpanInSecond(new Date()) - previousLock;
    }

    const workTime = runningTime - breakTime;
    return new WorkTimesModel(runningTime, breakTime, workTime);
  }

  private getTimeSpanInSecond(date: Date): number {
    return date.getTime() / 1000;
  }
}
