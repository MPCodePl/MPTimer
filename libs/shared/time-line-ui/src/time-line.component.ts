import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { TimeLineSectionActivityModel, TimeLineSectionModel } from './models';
import { TooltipModule } from 'primeng/tooltip';
import { TimeLineSectionActionModel } from './models/time-line-section-action.model';

const MIN_HOUR = 7;
const MAX_HOUR = 17;

@Component({
  selector: 'lib-time-line',
  standalone: true,
  imports: [CommonModule, JsonPipe, DatePipe, TooltipModule],
  templateUrl: './time-line.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeLineComponent {
  public sections = input.required<TimeLineSectionModel[]>();

  public hours = computed(() =>
    this.getHours(this.allActivities(), this.allActions())
  );
  public allActivities = computed(() =>
    this.sections().flatMap((s) => s.activities ?? [])
  );
  public allActions = computed(() =>
    this.sections().flatMap((s) => s.actions ?? [])
  );

  public getGridTemplateColumns(hours: number[]): string {
    return Array(hours.length)
      .fill(1)
      .map(() => '1fr')
      .join(' ');
  }

  public getActivityStart(
    activity: TimeLineSectionActivityModel,
    hours: number[]
  ): number {
    return this.getStart(activity, hours, (f) => f.from);
  }

  public getActionStart(
    action: TimeLineSectionActionModel,
    hours: number[]
  ): number {
    return this.getStart(action, hours, (f) => f.date);
  }

  public getStart<T>(
    activity: T,
    hours: number[],
    fn: (item: T) => Date
  ): number {
    const TOTAL_MINUTES = 60 * hours.length;
    const startHour = hours[0] ?? MIN_HOUR;
    const activityStartMinutes =
      60 * fn(activity).getHours() + fn(activity).getMinutes() - startHour * 60;
    return (activityStartMinutes / TOTAL_MINUTES) * 100;
  }

  public getWidth(
    activity: TimeLineSectionActivityModel,
    hours: number[]
  ): number {
    const TOTAL_MINUTES = 60 * hours.length;
    const to = activity.to ?? new Date();
    const activityWidthMinutes =
      60 * to.getHours() +
      to.getMinutes() -
      (60 * activity.from.getHours() + activity.from.getMinutes());
    return (activityWidthMinutes / TOTAL_MINUTES) * 100;
  }

  public getTo(date?: Date): Date {
    return date ?? new Date();
  }

  private getHours(
    sections: TimeLineSectionActivityModel[],
    actions: TimeLineSectionActionModel[]
  ): number[] {
    const min = sections
      .map((s) => s.from)
      .concat(actions.map((a) => a.date))
      .map((f) => f.getHours())
      .reduce((p, c) => Math.min(p, c), MIN_HOUR);
    const max = sections
      .map((s) => s.to ?? new Date())
      .concat(actions.map((a) => a.date))
      .map((f) => f.getHours() + 1)
      .reduce((p, c) => Math.max(p, c), MAX_HOUR);
    return Array(max - min + 1)
      .fill(1)
      .map((v, index) => {
        return index + min;
      });
  }
}
