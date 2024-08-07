import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@knowledge-sandbox-nx/backoffice-app-feature').then(
        (m) => m.BACK_OFFICE_APP_ROUTES
      ),
  },
];
