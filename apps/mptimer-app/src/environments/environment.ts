export const environment = {
  msalConfig: {
    auth: {
      clientId: '34443707-da14-42ca-8546-2dccc523f2e0',
    },
  },
  apiConfig: {
    scopes: [''],
    uri: '',
  },
  b2cPolicies: {
    names: {
      signUpSignIn: 'B2C_1_mptimersignupsignin',
      resetPassword: 'B2C_1_PasswordReset',
    },
    authorities: {
      signUpSignIn: {
        authority:
          'https://mptimer.b2clogin.com/mptimer.onmicrosoft.com/B2C_1_mptimersignupsignin',
      },
      signUp: {
        authority:
          'https://mptimer.b2clogin.com/mptimer.onmicrosoft.com/B2C_1_mptimersignup',
      },
      resetPassword: {
        authority:
          'https://mptimer.b2clogin.com/mptimer.onmicrosoft.com/B2C_1_PasswordReset',
      },
    },
    authorityDomain: 'https://mptimer.b2clogin.com/mptimer.onmicrosoft.com/',
  },

  /*clientId: ,
    authority:
      'https://mptimer.b2clogin.com/mptimer.onmicrosoft.com/B2C_1_mptimersignupsignin',
    scopes: [
      'https://mptimer.onmicrosoft.com/api/spectators.read',
      'https://mptimer.onmicrosoft.com/api/spectators.add',
    ],
*/
};
