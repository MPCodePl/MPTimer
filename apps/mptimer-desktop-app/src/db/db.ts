import log from 'electron-log/main';
import * as sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();

export class DB {
  private static dbPath: string;

  public static initialize(dbPath: string) {
    this.dbPath = dbPath;
  }

  public static connect(): sqlite.Database {
    return this.createDb(this.dbPath);
  }

  private static createDb(dbPath: string): sqlite.Database {
    try {
      log.debug(`Connecting to db at '${dbPath}'`);
      const db = new sqlite3.Database(dbPath);
      log.debug('DB connected');
      return db;
    } catch (err) {
      log.error(`Error when creating db ${JSON.stringify(err)}`);
      throw err;
    }
  }
}
