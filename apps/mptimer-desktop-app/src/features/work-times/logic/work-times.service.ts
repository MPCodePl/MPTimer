import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged,
  interval,
  map,
} from 'rxjs';
import { EventModel } from '../../events/models/event.model';
import { WorkTimesModel } from '../models/work-times.model';
import { Store } from 'redux';
import { getEvents } from '../../events/+state';

export class WorkTimesService {
  private allEventsSubject$ = new BehaviorSubject<EventModel[]>([]);
  public allEvents$ = this.allEventsSubject$.asObservable();

  constructor(private store: Store) {
    const handleStateChange = () => {
      const state = store.getState();
      const currentEvents = getEvents(state);
      this.allEventsSubject$.next(currentEvents);
    };

    store.subscribe(handleStateChange);
  }

  public workTimes$ = this.allEventsSubject$.pipe(
    distinctUntilChanged(),
    combineLatestWith(interval(1000)),
    map(([events]) => this.countWorkTimes(events))
  );

  private countWorkTimes(events: EventModel[]): WorkTimesModel {
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
