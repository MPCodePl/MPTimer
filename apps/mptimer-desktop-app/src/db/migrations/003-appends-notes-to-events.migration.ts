import { Database } from 'sqlite3';
import { Migration } from '../migration';

export class M003AppendNotesToEvents extends Migration {
  constructor() {
    super('003 Append notes to events');
  }

  public override execute(db: Database): void {
    db.run(`ALTER TABLE main.Event ADD "notes" TEXT NULL`);
  }
}
