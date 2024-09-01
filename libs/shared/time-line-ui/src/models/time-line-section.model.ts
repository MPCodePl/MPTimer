import { TimeLineSectionActivityModel } from './time-line-section-activity.model';
import { Color } from 'colors';

export interface TimeLineSectionModel {
  id: string;
  name: string;
  activities: TimeLineSectionActivityModel[];
  color: Color;
}
