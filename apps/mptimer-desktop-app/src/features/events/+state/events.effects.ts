import {
  NEVER,
  catchError,
  filter,
  from,
  interval,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs';
import { addEvent, addEventSuccess, loadEvents, loadEventsSuccess } from '.';
import { combineEpics } from 'redux-observable';
import { EventsDbService } from '../logic/events-db.service';
import { EventModel } from 'event-models';

export default function eventsEpics(service: EventsDbService) {
  const loadEvents$ = (action$) =>
    action$.pipe(
      filter(loadEvents.match),
      map((action) => ({
        type: action['type'],
        payload: action['payload'] as Date,
      })),
      mergeMap(({ payload }) =>
        from(service.loadEvents(payload)).pipe(
          map((events) => loadEventsSuccess(events))
        )
      ),
      catchError((err) => {
        console.error(err);
        return NEVER;
      })
    );

  const addEvent$ = (action$) =>
    action$.pipe(
      filter(addEvent.match),
      map((action) => ({
        type: action['type'],
        payload: action['payload'] as EventModel,
      })),
      mergeMap(({ payload }) =>
        from(service.addEvent(payload)).pipe(
          map(() => addEventSuccess(payload)),
          catchError((err) => {
            console.error(err);
            return NEVER;
          })
        )
      )
    );

  const alive$ = () =>
    interval(60 * 1000).pipe(
      map(() => addEvent(new EventModel('Alive'))),
      catchError((err) => {
        console.error(err);
        return NEVER;
      })
    );

  const dayChanged$ = (action$, state$) =>
    interval(1000).pipe(
      withLatestFrom(state$),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter(([, state]) => (state as any).event.date != null),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter(
        ([, state]) =>
          (state as any).event.date.toDateString() !== new Date().toDateString()
      ),
      map(() => loadEvents(new Date())),
      catchError((err) => {
        console.error(err);
        return NEVER;
      })
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return combineEpics<unknown, any>(
    loadEvents$,
    alive$,
    addEvent$,
    dayChanged$
  );
}
