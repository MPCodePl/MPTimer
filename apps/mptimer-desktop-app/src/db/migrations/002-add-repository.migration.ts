import { Database } from 'sqlite3';
import { Migration } from '../migration';

export class M002AddRepositoryTable extends Migration {
  constructor() {
    super('001 Add Repository Table');
  }

  public override execute(db: Database): void {
    db.run(`CREATE TABLE "Repository" (
      "id"	TEXT NOT NULL UNIQUE,
      "name"	TEXT NOT NULL,
      "date"	TEXT NOT NULL,
      "path"    TEXT NOT NULL,
      "synced"	INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY("id")
    )`);
  }
}
