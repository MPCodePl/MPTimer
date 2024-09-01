import { AfterViewInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { DateUtils, TimeSpan } from '@app/shared';
import { BehaviorSubject, combineLatest, interval, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';
import { WorkTimeLineActivityModel, WorkTimeLineEventModel, WorkTimeLineSectionModel } from '../models';

@Component({
  selector: 'app-work-time-line-view',
  templateUrl: './work-time-line-view.component.html',
  styleUrls: ['./work-time-line-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTimeLineViewComponent implements OnInit, OnChanges {

  @Input()
  public sections: WorkTimeLineSectionModel[] = [];
  private sections$ = new BehaviorSubject<WorkTimeLineSectionModel[]>([]);
  private updateDates$ = interval(1000);

  private sectionsWithHours$ = combineLatest([
    this.sections$,
    this.updateDates$,
  ]).pipe(
    map(([sections]) => ({
      sections,
      activities: this.selectMany(this.selectMany(sections, s => s.events), e => e.activities),
    })),
    map(vm => ({
      ...vm,
      minHour: Math.max(vm.activities.reduce((a, b) => (b.from.getHours() < a) ? b.from.getHours() : a, 8), 0),
      maxHour: Math.min(vm.activities.reduce((a, b) => {
        const to = b.to ?? new Date();
        return (to.getHours() > a) ? to.getHours() : a;
      }, 16) + 2, 24),
    })),
    map(vm => ({
      ...vm,
      hourArray: Array(vm.maxHour - vm.minHour).fill(1),
    })),
  );

  public eventTimes$ = combineLatest([
    this.sections$,
    this.updateDates$,
  ]).pipe(
    map(([sections]) => ({
      events: this.selectMany(sections, s => s.events),
      now: new Date(),
    })),
    map((eventsVm) => eventsVm.events.map(event => {
      const totalSeconds = event.activities.reduce((previous, current) => {
        var diff = (current.to ?? eventsVm.now).getTime() - current.from.getTime();
        var seconds = Math.floor(diff / 1000);
        return seconds + previous;
      }, 0);

      return {
        eventId: event.id,
        total: TimeSpan.createFromSeconds(totalSeconds),
        isWorking: event.activities.some(a => a.to == null),
      };
    })),
  );

  private currentTimeVisible = new BehaviorSubject<boolean>(false);
  public currentTimeVisible$ = this.currentTimeVisible.asObservable();

  private containersWidth$ = interval(100).pipe(
    startWith(0),
    filter(() => this.scrollableWidthDiv != null),
    map(() => this.scrollableWidthDiv?.nativeElement.clientWidth),
    distinctUntilChanged(),
    map((cw) => ({
      containerWidth: cw,
      hourContainerWidth: Math.max(cw, 600) - 120,
      scrollSizePx: Math.max(cw, 600),
    })),
  );
  
  public vm$ = combineLatest([
    this.sectionsWithHours$,
    this.eventTimes$,
    this.containersWidth$,
  ]).pipe(
    map(([sectionsWithHours, eventTimes, containersWidth]) => ({
      ...sectionsWithHours,
      eventTimes,
      containerWidthPx: containersWidth.containerWidth,
      scrollSizePx: containersWidth.scrollSizePx,
      containersWidth,
    })),
    map((vm) => ({
      ...vm,
      hourWidth: vm.containersWidth.hourContainerWidth / (vm.maxHour - vm.minHour),
    })),
    map((vm) => ({
      ...vm,
      countedActivities: this.getCountedActivities(vm.activities, vm.hourWidth, vm.minHour),
    })),
  );

  @ViewChild('scrollableWidth')
  public scrollableWidthDiv?: ElementRef;
  @ViewChild('hourContainer')
  public hourContainer?: ElementRef;

  public mousePosition$ = new BehaviorSubject({
    x: 0,
    y :0,
    time: TimeSpan.empty(),
  });

  constructor() { }

  private getCountedActivities(activities: WorkTimeLineActivityModel[], hourWidth: number, minHour: number): { id: string, left: number, width: number }[] {
    return activities.map(activity => {
      const left = this.getXByTime(activity.from.getHours(), activity.from.getMinutes(), hourWidth, minHour);
      const to = activity.to ?? new Date();
      const width = this.getXByTime(to.getHours(), to.getMinutes(), hourWidth, minHour) - left;
      return ({
        id: activity.id,
        left,
        width,
        time: this.getDiffrence(activity.from, activity.to),
      });
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sections != null) {
      this.sections$.next(this.sections);
    }
  }

  public getActivityStyles(activity: WorkTimeLineActivityModel, event: WorkTimeLineEventModel, vm: any): any {
    const countedActivity = vm.countedActivities.find((a: any) => a.id == activity.id);
    return {
      'background-color': event.color,
      'left.px': countedActivity.left,
      'width.px': countedActivity.width,
    };
  }

  public getActivityTime(activity: WorkTimeLineActivityModel, vm: any): TimeSpan {
    return vm.countedActivities.find((a: any) => a.id == activity.id).time;
  }

  public getActivityTooltip(activity: WorkTimeLineActivityModel, event: WorkTimeLineEventModel): string {
    const diffrence = this.getDiffrence(activity.from, activity.to);
    return `${event.name}
      From: ${DateUtils.format(activity.from)}
      To: ${activity.to != null ? DateUtils.format(activity.to) : 'Still working'}
      Total: ${diffrence.format()}${activity.notes != null ? `\n${activity.notes}` : ''}`;
  }

  public getEventTime(vm: any, event: WorkTimeLineEventModel): string {
    const total = vm.eventTimes.find((e: any) => e.eventId === event.id).total;
    return total.format();
  }

  public getEventIsWorking(vm: any, event: WorkTimeLineEventModel): boolean {
    return vm.eventTimes.find((e: any) => e.eventId === event.id).isWorking;
  }

  public mouseEnter(): void {
    this.currentTimeVisible.next(true);
  }

  public mouseLeave(): void {
    this.currentTimeVisible.next(false);
  }

  public mouseMove(event: MouseEvent, outerDiv: HTMLElement, vm: any): void {
    const bounds = outerDiv.getBoundingClientRect();
    const posX = event.clientX - bounds.left;
    const posY = event.clientY - bounds.top;
    this.mousePosition$.next({
      x: posX,
      y: posY,
      time: this.getTimeByX(posX, vm),
    });
  }

  public getXByTime(hour: number, minute: number, hourWidth: number, minHour: number): number {
    const hourIndex = hour - minHour;
    return hourIndex * hourWidth + minute / 60 * hourWidth + hourWidth;
  }

  public getTimeByX(x: number, vm: any): TimeSpan {
    const hourWidth = vm.hourWidth;
    const minHour = vm.minHour;
    const hourIndex = Math.floor(x / hourWidth);
    const hour = hourIndex + minHour - 1;
    const minute = Math.floor((x - hourIndex * hourWidth) / hourWidth * 60);
    return new TimeSpan(hour, minute, 0);
  }

  private getDiffrence(date1: Date, date2?: Date): TimeSpan {
    var diff = (date2 ?? new Date()).getTime() - date1.getTime();
    var seconds = Math.floor(diff / 1000);
    return TimeSpan.createFromSeconds(seconds);
  }

  private selectMany<T, F>(src: T[], fn: (arg: T) => F[]): F[] {
    return src.reduce((current, previous) => current.concat(fn(previous)), [] as F[]);
  }
}
