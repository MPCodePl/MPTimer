import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeAppHeaderDumbComponent } from '../../dumb';

@Component({
  selector: 'lib-backoffice-app-header-smart',
  standalone: true,
  imports: [CommonModule, BackofficeAppHeaderDumbComponent],
  templateUrl: './backoffice-app-header-smart.component.html',
  styleUrl: './backoffice-app-header-smart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackofficeAppHeaderSmartComponent {}
