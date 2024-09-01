import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { TimeLineSectionActivityModel, TimeLineSectionModel } from './models';
import { TooltipModule } from 'primeng/tooltip';

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

  public hours = computed(() => this.getHours(this.activities()));
  public activities = computed(() =>
    this.sections().flatMap((s) => s.activities)
  );

  public getGridTemplateColumns(hours: number[]): string {
    return Array(hours.length)
      .fill(1)
      .map(() => '1fr')
      .join(' ');
  }

  public getStart(
    activity: TimeLineSectionActivityModel,
    hours: number[]
  ): number {
    const TOTAL_MINUTES = 60 * hours.length;
    const startHour = hours[0] ?? MIN_HOUR;
    const activityStartMinutes =
      60 * activity.from.getHours() +
      activity.from.getMinutes() -
      startHour * 60;
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

  public getTo(date: Date): Date {
    return date ?? new Date();
  }

  private getHours(sections: TimeLineSectionActivityModel[]): number[] {
    const min = sections
      .map((s) => s.from)
      .map((f) => f.getHours())
      .reduce((p, c) => Math.min(p, c), MIN_HOUR);
    const max = sections
      .map((s) => s.to ?? new Date())
      .map((f) => f.getHours() + 1)
      .reduce((p, c) => Math.max(p, c), MAX_HOUR);
    return Array(max - min + 1)
      .fill(1)
      .map((v, index) => {
        return index + min;
      });
  }
}
