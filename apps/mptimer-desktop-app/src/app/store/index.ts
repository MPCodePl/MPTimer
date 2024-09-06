import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { Epic, combineEpics, createEpicMiddleware } from 'redux-observable';
import { eventSlice } from '../../features/events/+state';
import { repositorySlice } from '../../features/repositories/+state';

export const rootReducer = combineSlices(eventSlice, repositorySlice);

const epicMiddleware = createEpicMiddleware();

export default function setupStore(
  epics: Epic<unknown, unknown, void, unknown>[]
) {
  const rootEpic = combineEpics(...epics);

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(epicMiddleware),
  });

  epicMiddleware.run(rootEpic);

  return store;
}
