import {
  ChangeDetectionStrategy,
  Component,
  model,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-backoffice-app-sidebar-dumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backoffice-app-sidebar-dumb.component.html',
  styleUrl: './backoffice-app-sidebar-dumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackofficeAppSidebarDumbComponent {
  public $expanded = signal(false);
  public $menuItems = signal([
    {
      label: 'Dashboard',
      icon: 'ri-dashboard-2-line',
    },
  ]);

  public toggleExpanded(): void {
    this.$expanded.set(!this.$expanded());
  }
}

interface MenuItem {
  label: string;
  icon: string;
}
