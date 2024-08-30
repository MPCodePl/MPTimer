import * as sqlite from 'sqlite3';

export abstract class Migration {
  constructor(private _name: string) {}

  public get name() {
    return this._name;
  }

  public abstract execute(db: sqlite.Database): void;
}
