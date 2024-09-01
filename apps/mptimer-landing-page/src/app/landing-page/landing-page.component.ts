import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { TimeLineSectionModel, TimeLineComponent } from 'time-line-ui';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeLineComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  private msalService = inject(MsalService);

  public EXAMPLE_SECTIONS: TimeLineSectionModel[] = [
    {
      id: 'TestId',
      name: 'Work time',
      color: '#ffbb33',
      activities: [
        {
          id: 'Activity11',
          from: new Date(1910, 12, 14, 8, 0, 0),
          to: new Date(1910, 12, 14, 10, 0, 0),
        },
        {
          id: 'Activity12',
          from: new Date(1910, 12, 14, 10, 15, 0),
          to: new Date(1910, 12, 14, 11, 0, 0),
        },
        {
          id: 'Activity13',
          from: new Date(1910, 12, 14, 11, 30, 0),
          to: new Date(1910, 12, 14, 14, 0, 0),
        },
      ],
    },
    {
      id: 'TestId2',
      name: 'Idle time',
      color: '#1e90ff',
      activities: [
        {
          id: 'Activity21',
          from: new Date(1910, 12, 14, 8, 30, 0),
          to: new Date(1910, 12, 14, 8, 45, 0),
        },
        {
          id: 'Activity22',
          from: new Date(1910, 12, 14, 10, 30, 0),
          to: new Date(1910, 12, 14, 10, 35, 0),
        },
        {
          id: 'Activity23',
          from: new Date(1910, 12, 14, 11, 45, 0),
          to: new Date(1910, 12, 14, 11, 52, 0),
        },
        {
          id: 'Activity23',
          from: new Date(1910, 12, 14, 14, 0, 0),
          to: new Date(1910, 12, 14, 16, 45, 0),
        },
      ],
    },
  ];

  public signUp(): void {
    this.msalService.loginRedirect();
  }
}
