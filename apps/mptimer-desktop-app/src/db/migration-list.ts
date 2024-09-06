import { Migration } from './migration';
import { M001AddEventsTable } from './migrations/001-add-events.migration';
import { M002AddRepositoryTable } from './migrations/002-add-repository.migration';
import { M003AppendNotesToEvents } from './migrations/003-appends-notes-to-events.migration';

export const MIGRATION_LIST: Migration[] = [
  new M001AddEventsTable(),
  new M002AddRepositoryTable(),
  new M003AppendNotesToEvents(),
];
