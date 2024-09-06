import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged,
  interval,
  map,
} from 'rxjs';
import { Store } from 'redux';
import { getEvents } from '../../events/+state';
import { EventModel } from 'event-models';
import { EventLogic } from 'event-logic';

export class WorkTimesService {
  private allEventsSubject$ = new BehaviorSubject<EventModel[]>([]);
  public allEvents$ = this.allEventsSubject$.asObservable();
  private eventLogic = new EventLogic();

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
    map(([events]) => this.eventLogic.countWorkTimes(events))
  );
}
