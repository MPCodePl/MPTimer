import { Store } from 'redux';
import { RepositoryModel } from 'repository-models';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  interval,
  startWith,
  withLatestFrom,
} from 'rxjs';
import { getRepositories } from '../+state';
import { readFile } from 'fs';
import { join } from 'path';
import * as log from 'electron-log';
import { WorkTimesService } from '../../work-times/logic/work-times.service';
import { EventsDbService } from '../../events/logic/events-db.service';
import { EventModel } from 'event-models';
import { addEvent } from '../../events/+state';

export class RepositoryService {
  private allRepositoriesSubject$ = new BehaviorSubject<RepositoryModel[]>([]);
  public allRepositories$ = this.allRepositoriesSubject$.asObservable();
  private branchReadedSubject$ = new Subject<{
    repositoryId: string;
    branchName: string;
  }>();
  public branchReaded$ = this.branchReadedSubject$.asObservable();

  constructor(
    private store: Store,
    private workTimesService: WorkTimesService,
    private eventDbService: EventsDbService
  ) {
    const handleStateChange = () => {
      const state = store.getState();
      const currentRepositories = getRepositories(state);
      this.allRepositoriesSubject$.next(currentRepositories);
    };
    this.store.subscribe(handleStateChange);
  }

  public init(): void {
    this.branchReaded$
      .pipe(withLatestFrom(this.workTimesService.allEvents$))
      .subscribe(([{ branchName, repositoryId }, events]) => {
        let branchChangeEvents = events.filter(
          (e) =>
            e.type === 'RepositoryBranchChange' &&
            (e.notes as any)?.repositoryId === repositoryId
        );
        let branchChangeEventsSorted = [...branchChangeEvents].sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        );
        const lastEvent =
          branchChangeEventsSorted[branchChangeEventsSorted.length - 1];
        const previousBranch = (lastEvent?.notes as any)?.branchName as string;
        if (previousBranch === branchName) {
          log.debug(`Branch checked - no change`);
          return;
        }

        log.debug(
          `Branch changed detected - from '${previousBranch}' to '${branchName}'`
        );
        const branchChangeEvent = new EventModel('RepositoryBranchChange');
        branchChangeEvent.notes = {
          branchName,
          repositoryId,
        };
        this.store.dispatch(addEvent(branchChangeEvent));
      });

    interval(60 * 1000)
      .pipe(startWith(-1))
      .subscribe(() => {
        const repositories = this.allRepositoriesSubject$.value;
        for (const repository of repositories) {
          this.checkRepositoryBranch(repository);
        }
      });
  }

  private async checkRepositoryBranch(
    repository: RepositoryModel
  ): Promise<void> {
    const repositoryHeadPath = join(repository.path, '.git', 'HEAD');
    readFile(repositoryHeadPath, 'utf8', (err, data) => {
      if (err) {
        log.error(
          `Error when reading '${repository.name}' path '${repositoryHeadPath}'`
        );
        return;
      }

      log.debug(`Read repository '${repository.name}' branch '${data}'.`);
      this.branchReadedSubject$.next({
        repositoryId: repository.id,
        branchName: data,
      });
    });
  }
}
