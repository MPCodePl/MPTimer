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

export const Default: Story = {
  args: {},
};

export const Pinned: Story = {
  args: {},
};

export const Archived: Story = {
  args: {},
};
