import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { TimeLineSectionModel } from 'libs/shared/time-line-ui/src/models';
import { TimeLineComponent } from 'time-line-ui';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, TimeLineComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private msalService = inject(MsalService);

  public year = new Date().getFullYear();
  public githubLink = 'https://github.com/MPCodePl/MPTimer';

  public exampleSections: TimeLineSectionModel[] = [
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

  constructor() {
    this.msalService.initialize();
  }

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe();
  }
}
