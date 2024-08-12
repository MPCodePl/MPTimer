import { Route } from '@angular/router';
import { StartUsingPageComponent } from './start-using-page/start-using-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const appRoutes: Route[] = [
  {
    path: 'start-using',
    component: StartUsingPageComponent,
  },
  {
    path: '',
    component: LandingPageComponent,
  },
];
