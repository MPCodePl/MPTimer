import { RepositoryModel } from 'repository-models';
import log from 'electron-log';
import { DB } from 'apps/mptimer-desktop-app/src/db/db';
import { Database } from 'sqlite3';

export class RepositoryDbService {
  public async addRepository(repository: RepositoryModel): Promise<void> {
    log.debug(`${RepositoryDbService.name}.addRepository - start`, repository);
    const db = DB.connect();
    try {
      await this.addRepositoryInternal(db, repository);
    } catch (err) {
      log.debug(
        `${RepositoryDbService.name}.addRepository - error`,
        JSON.stringify(err)
      );
      throw err;
    } finally {
      db.close();
    }
  }

  private addRepositoryInternal(
    db: Database,
    repository: RepositoryModel
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Repository (id, name, date, path, synced) VALUES ("${
        repository.id
      }", "${repository.name}", "${repository.date.toISOString()}", "${
        repository.path
      }", 0)`;
      db.run(sql, (err) => {
        if (err != null) {
          log.error(
            `${RepositoryDbService.name}.addRepositoryInternal - error when adding entry`,
            JSON.stringify(err)
          );
          reject(err);
        }

        resolve();
        log.debug(
          `${RepositoryDbService.name}.addRepositoryInternal - repository added`
        );
      });
    });
  }

  public async removeRepository(repositoryId: string): Promise<void> {
    log.debug(
      `${RepositoryDbService.name}.removeRepository - start`,
      repositoryId
    );
    const db = DB.connect();
    try {
      await this.removeRepositoryInternal(db, repositoryId);
    } catch (err) {
      log.debug(
        `${RepositoryDbService.name}.removeRepository - error`,
        JSON.stringify(err)
      );
      throw err;
    } finally {
      db.close();
    }
  }

  private removeRepositoryInternal(
    db: Database,
    repositoryId: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM main.Repository WHERE Id = '${repositoryId}'`;
      db.run(sql, (err) => {
        if (err != null) {
          log.error(
            `${RepositoryDbService.name}.removeRepositoryInternal - error when removing entry`,
            JSON.stringify(err)
          );
          reject(err);
        }

        resolve();
        log.debug(
          `${RepositoryDbService.name}.removeRepositoryInternal - repository removed`
        );
      });
    });
  }

  public async loadRepositories(): Promise<RepositoryModel[]> {
    log.debug(`${RepositoryDbService.name}.loadRepositories - start`);
    const db = DB.connect();
    try {
      return await this.loadRepositoriesInternal(db);
    } catch (err) {
      log.debug(
        `${RepositoryDbService.name}.loadRepositories - error`,
        JSON.stringify(err)
      );
      throw err;
    } finally {
      db.close();
    }
  }

  private loadRepositoriesInternal(db: Database): Promise<RepositoryModel[]> {
    return new Promise((resolve, reject) => {
      db.all<RepositoryModel>(
        `SELECT id, name, path, date, synced FROM Repository`,
        (err, rows) => {
          if (err != null) {
            log.error(
              `${RepositoryDbService.name}.loadRepositoriesInternal - error when getting repositories`,
              JSON.stringify(err)
            );
            reject(err);
          }

          log.debug(
            `${RepositoryDbService.name}.loadRepositoriesInternal - Repositories loaded ${rows.length}`
          );
          resolve(rows.map((r) => ({ ...r, date: new Date(r.date) })));
        }
      );
    });
  }
}
