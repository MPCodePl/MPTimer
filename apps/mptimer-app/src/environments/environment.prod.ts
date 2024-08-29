export const environment = {
  msalConfig: {
    auth: {
      clientId: '#{{APP_CLIENT_ID}}#',
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
};
