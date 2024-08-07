import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BackofficeAppHeaderSmartComponent } from '../backoffice-app-header-smart';
import { BackofficeAppSidebarDumbComponent } from '../../dumb';

@Component({
  selector: 'lib-backoffice-app-layout-smart',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BackofficeAppHeaderSmartComponent,
    BackofficeAppSidebarDumbComponent,
  ],
  templateUrl: './backoffice-app-layout-smart.component.html',
  styleUrl: './backoffice-app-layout-smart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackofficeAppLayoutSmartComponent {}
