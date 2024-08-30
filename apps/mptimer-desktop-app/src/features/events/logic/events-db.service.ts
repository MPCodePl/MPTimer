import { Database } from 'sqlite3';
import { DB } from '../../../db/db';
import { DateUtils } from '../../utils/date.utils';
import { EventModel } from '../models/event.model';
import log from 'electron-log';

export class EventsDbService {
  public async addEvent(event: EventModel): Promise<void> {
    log.debug(`${EventsDbService.name}.addEvent - start`, event);
    const db = DB.connect();
    try {
      await this.addEventInternal(db, event);
    } catch (err) {
      log.debug(
        `${EventsDbService.name}.addEvent - error`,
        JSON.stringify(err)
      );
      throw err;
    } finally {
      db.close();
    }
  }

  private addEventInternal(db: Database, event: EventModel): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Event (id, type, date, synced) VALUES ("${
        event.id
      }", "${event.type}", "${DateUtils.format(event.date, {
        includeTime: true,
      })}", 0)`;
      db.run(sql, (err) => {
        if (err != null) {
          log.error(
            `${EventsDbService.name}.addEventInternal - error when adding entry`,
            JSON.stringify(err)
          );
          reject(err);
        }

        resolve();
        log.debug(`${EventsDbService.name}.addEventInternal - event added`);
      });
    });
  }

  public async loadEvents(date: Date): Promise<EventModel[]> {
    log.debug(`${EventsDbService.name}.loadEvents - start`);
    const db = DB.connect();
    try {
      return await this.loadEventsInternal(db, date);
    } catch (err) {
      log.debug(
        `${EventsDbService.name}.loadEvents - error`,
        JSON.stringify(err)
      );
      throw err;
    } finally {
      db.close();
    }
  }

  private loadEventsInternal(db: Database, date: Date): Promise<EventModel[]> {
    return new Promise((resolve, reject) => {
      const dateAsString = DateUtils.format(date, { includeTime: false });
      db.all<EventModel>(
        `SELECT id, type, date, synced FROM Event WHERE Date LIKE '${dateAsString}%'`,
        (err, rows) => {
          if (err != null) {
            log.error(
              `${EventsDbService.name}.loadEventsInternal - error when getting entries`,
              JSON.stringify(err)
            );
            reject(err);
          }

          log.debug(
            `${EventsDbService.name}.loadEventsInternal - Events loaded ${rows.length}`
          );
          resolve(rows.map((r) => ({ ...r, date: new Date(r.date) })));
        }
      );
    });
  }
}
