import { Injectable, signal } from '@angular/core';
import { EventModel } from 'event-models';

@Injectable()
export class EventsService {
  public $events = signal<EventModel[]>([]);

  public async init(): Promise<void> {
    const result = await (window as any).electron?.eventsInit();
    (window as any).electron.onEventsUpdated((events: EventModel[]) => {
      this.$events.set(events);
    });
    this.$events.set(result);
  }
}
