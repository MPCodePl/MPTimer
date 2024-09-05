import { GuidUtils } from 'utils';
import { MpEventType } from './mp-event-type.enum';

export class EventModel {
  public id = GuidUtils.generateGuid();

  constructor(public type: MpEventType, public date: Date = new Date()) {}
}
