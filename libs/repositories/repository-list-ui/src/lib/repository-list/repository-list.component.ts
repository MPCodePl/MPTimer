import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepositoryModel } from 'repository-models';

@Component({
  selector: 'lib-repository-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repository-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryListComponent {
  public repositories = input.required<RepositoryModel[]>();
  public removed = output<{ repositoryId: string }>();

  public remove(repositoryId: string): void {
    this.removed.emit({ repositoryId });
  }
}
