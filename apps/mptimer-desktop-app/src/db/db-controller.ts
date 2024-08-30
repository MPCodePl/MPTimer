import log from 'electron-log/main';
import * as sqlite from 'sqlite3';
import { DB } from './db';
import { Migration } from './migration';
const sqlite3 = sqlite.verbose();

const MIGRATION_TABLE_NAME = '__migrations';

export class DBController {
  public static async initialize(): Promise<void> {
    const db = DB.connect();
    try {
      await this.assertMigrationTable(db);
    } finally {
      db.close();
    }
  }

  public static migrate(migrations: Migration[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      log.debug('Migrating db to newest version.');
      const db = DB.connect();
      log.debug('Get executed migrations.');
      db.all<{ name: string }>(
        `SELECT name from ${MIGRATION_TABLE_NAME}`,
        (err, rows) => {
          if (err != null) {
            log.error(
              `Error when fetching migrations from migration table: ${JSON.stringify(
                err
              )}`
            );
            throw err;
          }

          if (rows.length > 0) {
            log.debug(
              `Migrations runned: ${rows.map((r) => r.name).join(',')}`
            );
          } else {
            log.debug('No migrations runned so far.');
          }

          const migrationsToRun = migrations.filter(
            (m) => !rows.some((r) => r.name === m.name)
          );
          if (migrationsToRun.length > 0) {
            log.debug(
              `Migrations to run: ${migrationsToRun
                .map((r) => r.name)
                .join(',')}`
            );
          } else {
            log.debug('No migrations to run.');
          }

          DBController.runMigrations(migrationsToRun, db).then(() => {
            resolve();
          });
        }
      );
    });
  }
  S;

  private static async runMigrations(
    migrationsToRun: Migration[],
    db: sqlite.Database
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const lastMigration = migrationsToRun[migrationsToRun.length - 1];
      if (migrationsToRun.length === 0) {
        resolve();
      }

      for (const migration of migrationsToRun) {
        db.serialize(() => {
          migration.execute(db);
          const stmt = db.prepare(
            `INSERT INTO ${MIGRATION_TABLE_NAME} (name, createdDate) VALUES (?,?)`
          );
          stmt.run(migration.name, new Date().toISOString());
          stmt.finalize(() => {
            const isLast = migration === lastMigration;
            if (isLast) {
              log.debug('All migrations runned');
              resolve();
            }
          });
        });
      }
    });
  }

  private static async assertMigrationTable(
    db: sqlite.Database
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        log.debug(
          `Checking if migration table '${MIGRATION_TABLE_NAME}' exists. If not adding new table.`
        );

        db.run(
          `CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE_NAME} (name TEXT PRIMARY KEY, createdDate TEXT)`,
          (err) => {
            if (err != null) {
              log.error(
                `Error when creating migration table: ${JSON.stringify(err)}`
              );
              reject(err);
            } else {
              log.info(`Migration table created.`);
              resolve();
            }
          }
        );
      });
    });
  }
}
