/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  // Version structure s.m.f.b : Upgrade system . Add module . Add feature . Build of upgrade/update
  version: '2.0.0.2',
  // 2.0.0.2: admin-product: fix assign categoies feature: lose Unit error
  // 2.0.0.1: Fix after update, update sales, admin-product
  // 2.0: Upgrade angular 9 and nebular 5
  // 1.0.3.43: Develop assign/revoke product categories: fix auto add new catgories
  // 1.0.3.42: Develop assign/revoke product categories
  // 1.0.3.26: Demo import purchase price table
  // 1.0 : First release
  production: true,
  hmr: false,
  basePath: 'probox-core',
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
