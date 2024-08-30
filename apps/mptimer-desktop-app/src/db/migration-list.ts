import { Migration } from './migration';
import { M001AddEventsTable } from './migrations/001-add-events.migration';

export const MIGRATION_LIST: Migration[] = [new M001AddEventsTable()];
