/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  // Version structure s.m.f.b.e: Upgrade system . Add module . Add feature . Build of upgrade/update . Environment
  version: '2.0.3.10',
  // 2.0.3.2: fix data-manager-list component: update grid after form udpate
  // 2.0.3.1: Dev basic purchase voucher list form print, fix lose product unit after save product
  // 2.0.2.13: Hot update admin product: keep select item after form update
  // 2.0.2.13: Contact detail
  // 2.0.2.9: Permission for each data row (share permission)
  // 2.0.2.7: Update Ivoip Cdrs status icon
  // 2.0.2.5: Fix Helpdesk permission
  // 2.0.2.4: Demo Helpdesl Manager (v2.0)
  // 2.0.2.3: Temporary fix currency pipe
  // 2.0.2.2: Fix CurrencyMassh no provider error
  // 2.0.2.1: Develop helpdesk, add header action control list feature
  // 2.0.1.2: Develop helpdesk, update user and group
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
