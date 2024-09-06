import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkTimesModel } from 'libs/events/event-logic/src/lib/work-times.model';
import { DateUtils } from 'utils';

@Component({
  selector: 'lib-work-time-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-time-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTimeUiComponent {
  public workTimes = input.required<WorkTimesModel>();

  public format(value: number): string {
    return DateUtils.formatTimeSpan(value);
  }
}
