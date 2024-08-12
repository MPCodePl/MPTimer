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
      signUp: 'B2C_1_mptimersignup',
    },
    authorities: {
      signUp: {
        authority:
          'https://mptimer.b2clogin.com/mptimer.onmicrosoft.com/B2C_1_mptimersignup',
      },
    },
    authorityDomain: 'https://mptimer.b2clogin.com/mptimer.onmicrosoft.com/',
  },
};
