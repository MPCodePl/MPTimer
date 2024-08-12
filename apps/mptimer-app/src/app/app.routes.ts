import { Route } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [MsalGuard],
    loadChildren: () =>
      import('mptimer/backoffice-app-feature').then(
        (m) => m.BACK_OFFICE_APP_ROUTES
      ),
  },
];
