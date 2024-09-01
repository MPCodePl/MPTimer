import type { Meta, StoryObj } from '@storybook/angular';

import { argsToTemplate } from '@storybook/angular';

import { action } from '@storybook/addon-actions';
import { TimeLineComponent } from './time-line.component';

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const meta: Meta<TimeLineComponent> = {
  title: 'Task',
  component: TimeLineComponent,
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: TimeLineComponent) => ({
    props: {
      ...args,
    },
    template: `<lib-time-line ${argsToTemplate(args)}></lib-time-line>`,
  }),
};

export default meta;
type Story = StoryObj<TimeLineComponent>;

export const Empty: Story = {
  args: toArgs<TimeLineComponent>({
    sections: [],
  }),
};

export const SectionWithNoneActivity: Story = {
  args: toArgs<TimeLineComponent>({
    sections: [
      {
        id: 'TestId',
        name: 'Example Section',
        color: '#ffbb33',
        activities: [],
      },
    ],
  }),
};

export const SectionWithSingleActivity: Story = {
  args: toArgs<TimeLineComponent>({
    sections: [
      {
        id: 'TestId',
        name: 'Example Section',
        color: '#ffbb33',
        activities: [
          {
            id: 'Activity1',
            from: new Date(1910, 12, 14, 8, 0, 0),
            to: new Date(1910, 12, 14, 10, 0, 0),
          },
        ],
      },
    ],
  }),
};

export const SectionBeforeAndAfterStandard: Story = {
  args: toArgs<TimeLineComponent>({
    sections: [
      {
        id: 'TestId',
        name: 'Example Section',
        color: '#ffbb33',
        activities: [
          {
            id: 'Activity1',
            from: new Date(1910, 12, 14, 4, 0, 0),
            to: new Date(1910, 12, 14, 4, 30, 0),
          },
          {
            id: 'Activity2',
            from: new Date(1910, 12, 14, 19, 0, 0),
            to: new Date(1910, 12, 14, 20, 0, 0),
          },
        ],
      },
    ],
  }),
};

export const SectionWithMultipleActivities: Story = {
  args: toArgs<TimeLineComponent>({
    sections: [
      {
        id: 'TestId',
        name: 'Example Section',
        color: '#ffbb33',
        activities: [
          {
            id: 'Activity1',
            from: new Date(1910, 12, 14, 8, 0, 0),
            to: new Date(1910, 12, 14, 10, 0, 0),
          },
          {
            id: 'Activity2',
            from: new Date(1910, 12, 14, 10, 15, 0),
            to: new Date(1910, 12, 14, 11, 0, 0),
          },
          {
            id: 'Activity3',
            from: new Date(1910, 12, 14, 11, 30, 0),
            to: new Date(1910, 12, 14, 14, 0, 0),
          },
        ],
      },
    ],
  }),
};

export const MultipleSectionsWithActivities: Story = {
  args: toArgs<TimeLineComponent>({
    sections: [
      {
        id: 'TestId',
        name: 'Example Section',
        color: '#ffbb33',
        activities: [
          {
            id: 'Activity11',
            from: new Date(1910, 12, 14, 8, 0, 0),
            to: new Date(1910, 12, 14, 10, 0, 0),
          },
          {
            id: 'Activity12',
            from: new Date(1910, 12, 14, 10, 15, 0),
            to: new Date(1910, 12, 14, 11, 0, 0),
          },
          {
            id: 'Activity13',
            from: new Date(1910, 12, 14, 11, 30, 0),
            to: new Date(1910, 12, 14, 14, 0, 0),
          },
        ],
      },
      {
        id: 'TestId2',
        name: 'Example Section Test 2',
        color: '#1e90ff',
        activities: [
          {
            id: 'Activity21',
            from: new Date(1910, 12, 14, 8, 30, 0),
            to: new Date(1910, 12, 14, 10, 15, 0),
          },
          {
            id: 'Activity22',
            from: new Date(1910, 12, 14, 10, 30, 0),
            to: new Date(1910, 12, 14, 11, 0, 0),
          },
          {
            id: 'Activity23',
            from: new Date(1910, 12, 14, 11, 45, 0),
            to: new Date(1910, 12, 14, 13, 30, 0),
          },
        ],
      },
    ],
  }),
};

function toArgs<Component>(
  args: Partial<TransformSignalInputType<TransformEventType<Component>>>
): TransformEventType<Component> {
  return args as unknown as TransformEventType<Component>;
}

/** Convert event emitter to callback for storybook */
type TransformEventType<T> = {
  [K in keyof T]: T[K] extends EventEmitter<infer E> ? (e: E) => void : T[K];
};

/** Convert any input signal into the held type of the signal */
type TransformSignalInputType<T> = {
  [K in keyof T]: TransformInputType<T[K]>;
};

import {
  InputSignalWithTransform,
  InputSignal,
  EventEmitter,
} from '@angular/core';

// Type to extract the type from InputSignal or InputSignalWithTransform
type TransformInputType<T> = T extends InputSignalWithTransform<infer U, any>
  ? U
  : T extends InputSignal<infer U>
  ? U
  : T;
