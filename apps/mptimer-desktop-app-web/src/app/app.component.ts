import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventsService } from './events.service';
import { JsonPipe } from '@angular/common';
import {
  TimeLineComponent,
  TimeLineSectionActionModel,
  TimeLineSectionActivityModel,
  TimeLineSectionModel,
} from 'time-line-ui';
import { EventModel, MpEventType } from 'event-models';
import { GuidUtils } from 'utils';
import { WorkTimeUiComponent } from 'work-time-ui';
import { EventLogic } from 'event-logic';
import { RepositoryService } from './repository.service';
import { RepositoryListComponent } from 'repository-list-ui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    JsonPipe,
    TimeLineComponent,
    WorkTimeUiComponent,
    RepositoryListComponent,
    ConfirmDialogModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [EventsService, RepositoryService, ConfirmationService],
})
export class AppComponent implements OnInit {
  private eventsService = inject(EventsService);
  private repositoryService = inject(RepositoryService);
  public $events = this.eventsService.$events;
  public $repositories = this.repositoryService.$repositories;

  public $sections = computed<TimeLineSectionModel[]>(() => [
    {
      id: 'RunTime',
      name: 'Run time',
      color: '#5d782e',
      activities: this.getRuntimes(this.$events()),
      actions: this.getActions(this.$events()),
    },
    {
      id: 'ScreenLock',
      name: 'Screen lock',
      color: '#5b3417',
      activities: this.getScreenLockActions(this.$events()),
    },
    {
      id: 'IdleTime',
      name: 'Idle time',
      color: '#f8dd4c',
      activities: this.getIdleTimeActions(this.$events()),
    },
    ...this.$repositories().map((r) => ({
      id: r.id,
      name: r.name,
      color: '#000',
      activities: this.getRepositoryBranches(this.$events(), r.id),
    })),
  ]);

  public $workTimes = computed(() =>
    new EventLogic().countWorkTimes(this.$events())
  );

  ngOnInit() {
    this.eventsService.init();
    this.repositoryService.init();
  }

  public async addRepository(): Promise<void> {
    (window as any).electron?.addRepository();
  }

  public removeRepository(args: { repositoryId: string }): void {
    this.repositoryService.remove({ repositoryId: args.repositoryId });
  }

  private getRuntimes(events: EventModel[]): TimeLineSectionActivityModel[] {
    const MAX_DIFFERENCE_BETWEEN_TIMES = 2 * 60 * 1000;
    const aliveEvents = events.filter((a) => a.type === 'Alive');
    const sortedAliveEvents = [...aliveEvents].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    let result: TimeLineSectionActivityModel[] = [];
    let previous: EventModel | null = null;

    for (const alive of sortedAliveEvents) {
      if (previous == null) {
        result.push({
          id: GuidUtils.generateGuid(),
          from: alive.date,
          to: alive.date,
        });
      }

      const lastRecord = result[result.length - 1];
      if (previous != null) {
        if (
          Math.abs(alive.date.getTime() - previous.date.getTime()) >
          MAX_DIFFERENCE_BETWEEN_TIMES
        ) {
          result.push({
            id: GuidUtils.generateGuid(),
            from: alive.date,
            to: alive.date,
          });
        } else {
          lastRecord.to = alive.date;
        }
      }

      previous = alive;
    }

    return result;
  }

  private getActions(events: EventModel[]): TimeLineSectionActionModel[] {
    const ACTIONS: MpEventType[] = ['AppStarted', 'AppStopped'];
    const actions = events.filter((e) => ACTIONS.includes(e.type));
    return actions.map((e) => ({
      id: e.id,
      date: e.date,
      name:
        e.type === 'AppStarted' ? 'Application started' : 'Application stoped',
      icon: e.type === 'AppStarted' ? 'ri-play-line' : 'ri-stop-circle-line',
    }));
  }

  private getScreenLockActions(
    events: EventModel[]
  ): TimeLineSectionActivityModel[] {
    return this.calculateActions(events, 'UserLock', 'UserUnlock');
  }

  private getIdleTimeActions(
    events: EventModel[]
  ): TimeLineSectionActivityModel[] {
    return this.calculateActions(events, 'UserIdle', 'UserUnIdle');
  }

  private getRepositoryBranches(
    events: EventModel[],
    repositoryId: string
  ): TimeLineSectionActivityModel[] {
    const branchChangeEvents = events.filter(
      (e) =>
        e.type === 'RepositoryBranchChange' &&
        (e.notes as any)?.repositoryId === repositoryId
    );
    const branchChangeEventsSorted = [...branchChangeEvents].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    let result: TimeLineSectionActivityModel[] = [];
    for (const event of branchChangeEventsSorted) {
      const previousResult = result[result.length - 1];
      if (previousResult != null) {
        previousResult.to = event.date;
      }

      result.push({
        id: event.id,
        from: event.date,
        notes: (event.notes as any)?.branchName,
      });
    }

    return result;
  }

  private calculateActions(
    events: EventModel[],
    startEvent: MpEventType,
    endEvent: MpEventType
  ): TimeLineSectionActivityModel[] {
    const LOCK_EVENT_TYPES: MpEventType[] = [startEvent, endEvent];
    const lockEvents = events.filter((e) => LOCK_EVENT_TYPES.includes(e.type));
    if (lockEvents.length === 0) {
      return [];
    }

    const sortedLockEvents = [...lockEvents].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    let result: TimeLineSectionActivityModel[] = [];
    for (const lockEvent of sortedLockEvents) {
      const lastLockEvent = result[result.length - 1];
      if (
        lockEvent.type === startEvent &&
        (lastLockEvent == null || lastLockEvent.to != null)
      ) {
        result.push({
          id: GuidUtils.generateGuid(),
          from: lockEvent.date,
          to: undefined,
        });
      }

      if (
        lockEvent.type === endEvent &&
        lastLockEvent != null &&
        lastLockEvent.to == null
      ) {
        lastLockEvent.to = lockEvent.date;
      }
    }

    return result;
  }
}
