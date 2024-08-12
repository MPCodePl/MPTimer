import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-start-using-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-using-page.component.html',
  styleUrl: './start-using-page.component.scss',
})
export class StartUsingPageComponent {
  private msalService = inject(MsalService);

  public signUp(): void {
    this.msalService.loginRedirect();
  }
}
