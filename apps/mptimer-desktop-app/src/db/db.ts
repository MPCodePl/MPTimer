import log from 'electron-log/main';
import { resolve } from 'path';
import * as sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();

const MIGRATION_TABLE_NAME = '__migrations';

export class DB {
  private static dbPath: string;

  public static async initialize(dbPath: string): Promise<void> {
    this.dbPath = dbPath;
    const db = this.createDb(dbPath);
    try {
      this.assertMigrationTable(db);
    } finally {
      db.close();
    }
  }

  private static async assertMigrationTable(db: sqlite.Database) {
    db.serialize(() => {
      log.info(
        `Checking if migration table '${MIGRATION_TABLE_NAME}' exists...`
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE_NAME} (migrationId TEXT PRIMARY KEY, createddate TEXT)`,
        (err) => {
          if (err != null) {
            log.error(
              `Error when creating migration table: ${JSON.stringify(err)}`
            );
          } else {
            log.info(`Migration table created.`);
          }
        }
      );
    });
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
