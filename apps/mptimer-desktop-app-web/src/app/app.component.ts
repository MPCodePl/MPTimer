import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'mptimer-desktop-app-web';

  constructor() {}

  async ngOnInit(): Promise<void> {
    const result = await (window as any).electron?.eventsInit();
    console.log(result);
    (window as any).electron.onEventsUpdated((events: any) => {
      console.log(events);
    });
  }
}
