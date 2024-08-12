import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private msalService = inject(MsalService);

  public year = new Date().getFullYear();
  public githubLink = 'https://github.com/MPCodePl/MPTimer';

  constructor() {
    this.msalService.initialize();
  }

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe();
  }
}
