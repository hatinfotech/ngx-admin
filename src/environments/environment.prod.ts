/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  hmr: false,
  basePath: 'mini-erp',
  register: {
    logo: {
      voucher: 'assets/images/logo/probox-voucher-logo.png',
    },
  },
  api: {
    baseUrl: '/v1',
  },
  number: {
    // replace by system locale
    thousandSeparator: ',',
  },
  localApp: {
    enabled: false,
    url: '/app/ITLocal/index.html',
  },
};
