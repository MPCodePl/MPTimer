import { NEVER, catchError, filter, from, map, mergeMap } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { RepositoryModel } from 'repository-models';
import { RepositoryDbService } from '../logic/repository-db.service';
import {
  addRepository,
  addRepositorySuccess,
  loadRepositories,
  loadRepositoriesSuccess,
  removeRepository,
  removeRepositorySuccess,
} from '.';

export default function repositoriesEpics(service: RepositoryDbService) {
  const loadRepositories$ = (action$) =>
    action$.pipe(
      filter(loadRepositories.match),
      map((action) => ({
        type: action['type'],
      })),
      mergeMap(() =>
        from(service.loadRepositories()).pipe(
          map((repositories) => loadRepositoriesSuccess({ repositories }))
        )
      ),
      catchError((err) => {
        console.error(err);
        return NEVER;
      })
    );

  const addRepository$ = (action$) =>
    action$.pipe(
      filter(addRepository.match),
      map((action) => ({
        type: action['type'],
        payload: action['payload'] as { repository: RepositoryModel },
      })),
      mergeMap(({ payload }) =>
        from(service.addRepository(payload.repository)).pipe(
          map(() => addRepositorySuccess(payload.repository)),
          catchError((err) => {
            console.error(err);
            return NEVER;
          })
        )
      )
    );

  const removeRepository$ = (action$) =>
    action$.pipe(
      filter(removeRepository.match),
      map((action) => ({
        type: action['type'],
        payload: action['payload'] as { repositoryId: string },
      })),
      mergeMap(({ payload }) =>
        from(service.removeRepository(payload.repositoryId)).pipe(
          map(() =>
            removeRepositorySuccess({ repositoryId: payload.repositoryId })
          ),
          catchError((err) => {
            console.error(err);
            return NEVER;
          })
        )
      )
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return combineEpics<unknown, any>(
    loadRepositories$,
    addRepository$,
    removeRepository$
  );
}
