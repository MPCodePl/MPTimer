import { Database } from 'sqlite3';
import { Migration } from '../migration';

export class M001AddEventsTable extends Migration {
  constructor() {
    super('001 Add events Table');
  }

  public override execute(db: Database): void {
    db.run(`CREATE TABLE "Event" (
      "id"	TEXT NOT NULL UNIQUE,
      "type"	TEXT NOT NULL,
      "date"	TEXT NOT NULL,
      "synced"	INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY("id")
    )`);
  }
}
