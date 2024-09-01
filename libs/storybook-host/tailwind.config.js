import { createGlobPatternsForDependencies } from '@nrwl/angular/tailwind';
import { join } from 'path';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '../**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../../apps/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
