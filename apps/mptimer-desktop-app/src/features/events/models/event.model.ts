import { GuidUtils } from "../../utils/guid.utils";
import { EventType } from "../enums/event-type.enum";

export class EventModel {

    public id = GuidUtils.generateGuid();

    constructor (
        public type: EventType,
        public date: Date = new Date()) {
        
    }
}
