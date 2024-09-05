import { createSelector, createSlice } from '@reduxjs/toolkit';
import { EventModel } from 'event-models';

export const eventSlice = createSlice({
  name: 'event',
  initialState: {
    events: [],
    date: null,
  },
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadEvents(state, action: { type: string; payload: Date }) {
      return {
        ...state,
        date: action.payload,
      };
    },
    loadEventsSuccess(state, action: { type: string; payload: EventModel[] }) {
      return {
        ...state,
        events: action.payload,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addEvent(state, action: { type: string; payload: EventModel }) {
      return state;
    },
    addEventSuccess(state, action: { type: string; payload: EventModel }) {
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    },
  },
});

// Selektor do pobierania całej listy użytkowników z Redux state
const getState = (state) => state.event;

// Selektor do pobierania tylko aktywnych użytkowników
export const getEvents = createSelector(
  [getState], // Przekazujemy inne selektory jako argumenty (w tym przypadku tylko getUsers)
  (state) => state.events
);

export const { loadEvents, loadEventsSuccess, addEvent, addEventSuccess } =
  eventSlice.actions;
