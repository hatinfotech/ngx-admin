/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  version: '1.0.3.49',
  // 1.0.3.49: Fix product form: copy categories error
  // 1.0.3.48: Develop dialog component resuable
  // 1.0.3.43: Develop assign/revoke product categories: fix auto add new catgories
  // 1.0.3.42: Develop assign/revoke product categories
  // 1.0.3.26: Demo import purchase price table
  // 1.0 : First release
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
