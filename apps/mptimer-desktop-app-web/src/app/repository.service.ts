import { Injectable, signal } from '@angular/core';
import { RepositoryModel } from 'repository-models';

@Injectable()
export class RepositoryService {
  public $repositories = signal<RepositoryModel[]>([]);

  public async init(): Promise<void> {
    const result = await (window as any).electron?.repositoryInit();
    (window as any).electron.onRepositoriesUpdated(
      (repositories: RepositoryModel[]) => {
        this.$repositories.set(repositories);
      }
    );
    this.$repositories.set(result);
  }

  public remove(args: { repositoryId: string }): void {
    (window as any).electron?.removeRepository({
      repositoryId: args.repositoryId,
    });
  }
}
