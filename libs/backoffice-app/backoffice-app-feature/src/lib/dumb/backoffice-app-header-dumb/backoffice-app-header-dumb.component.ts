import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-backoffice-app-header-dumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backoffice-app-header-dumb.component.html',
  styleUrl: './backoffice-app-header-dumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackofficeAppHeaderDumbComponent {}
