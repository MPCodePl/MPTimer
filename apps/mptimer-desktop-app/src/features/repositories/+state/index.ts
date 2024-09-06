import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RepositoryModel } from 'repository-models';

export const repositorySlice = createSlice({
  name: 'repository',
  initialState: {
    repositories: [],
  },
  reducers: {
    loadRepositories(state, action: { type: string }) {
      return state;
    },
    loadRepositoriesSuccess(
      state,
      action: { type: string; payload: { repositories: RepositoryModel[] } }
    ) {
      return {
        ...state,
        repositories: action.payload.repositories,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addRepository(
      state,
      action: { type: string; payload: { repository: RepositoryModel } }
    ) {
      return state;
    },
    addRepositorySuccess(
      state,
      action: { type: string; payload: { repository: RepositoryModel } }
    ) {
      return {
        ...state,
        repositories: [...state.repositories, action.payload],
      };
    },
    removeRepository(
      state,
      action: { type: string; payload: { repositoryId: string } }
    ) {
      return state;
    },
    removeRepositorySuccess(
      state,
      action: { type: string; payload: { repositoryId: string } }
    ) {
      console.log(state.repositories, action.payload.repositoryId);
      return {
        ...state,
        repositories: state.repositories.filter(
          (r) => r.id !== action.payload.repositoryId
        ),
      };
    },
  },
});

// Selektor do pobierania całej listy użytkowników z Redux state
const getState = (state) => state.repository;

// Selektor do pobierania tylko aktywnych użytkowników
export const getRepositories = createSelector(
  [getState], // Przekazujemy inne selektory jako argumenty (w tym przypadku tylko getUsers)
  (state) => state.repositories
);

export const {
  loadRepositories,
  loadRepositoriesSuccess,
  addRepository,
  addRepositorySuccess,
  removeRepository,
  removeRepositorySuccess,
} = repositorySlice.actions;
