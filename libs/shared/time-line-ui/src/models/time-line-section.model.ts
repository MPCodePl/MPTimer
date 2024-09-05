import { TimeLineSectionActionModel } from './time-line-section-action.model';
import { TimeLineSectionActivityModel } from './time-line-section-activity.model';
import { Color } from 'colors';

export interface TimeLineSectionModel {
  id: string;
  name: string;
  activities?: TimeLineSectionActivityModel[];
  actions?: TimeLineSectionActionModel[];
  color: Color;
}
