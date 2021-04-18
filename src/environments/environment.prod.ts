/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  // Version structure s.m.f.b.e: Upgrade system . Add module . Add feature . Build of upgrade/update . Environment
  version: '2.2.0.15',
  // 2.2.0.15: Dev slaes price report voucher: add sub contact info
  // 2.2.0.0: Begin develop for commerce modules
  // 2.1.1.1: add feature: Ivoip - include extension registrations 
  // 2.1.0.3: change logo 
  // 2.1.0.2: Fix scan2login 
  // 2.1.0.1: Dev simple contact list
  // 2.1.0.0: Begin dev accounting module
  // 2.0.5.16: Hotfix hosting module for mini-erp
  // 2.0.5.15: Demo connect zalo oa api and webhook: fix main socket reconnect and restore event whene chat server reload
  // 2.0.5.14: Demo connect zalo oa api and webhook: dev chat room state and restore
  // 2.0.5.13: Demo connect zalo oa api and webhook: fix route, event action
  // 2.0.5.12: Demo connect zalo oa api and webhook: socket event design perterm and apply for handle had new ticket event
  // 2.0.5.11: Demo connect zalo oa api and webhook: add zalo tags, auto map contact, design helpdesk dashboard,...
  // 2.0.5.10: Demo connect zalo oa api and webhook: add zalo tags, auto map contact,...
  // 2.0.5.9: Demo connect zalo oa api and webhook: auto create ticket, auto reply first message, auto send notification message on ticket state change
  // 2.0.5.7: Demo connect zalo oa api and webhook: dev message attachments
  // 2.0.5.6: Demo connect zalo oa api and webhook: receive attachments
  // 2.0.5.5: Demo connect zalo oa api and webhook: fix zalo gửi tin nhắn có thông báo
  // 2.0.5.4: Demo connect zalo oa api and webhook: set relate customer user to chat message
  // 2.0.5.3: Demo connect zalo oa api and webhook
  // 2.0.4.2: Update helpdesk module: develop route for call logs and web phone, some fix
  // 2.0.4.1: Update helpdesk module: collect and show mo info
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
      voucher: 'assets/images/logo/logo-dang-ky-nhan-hieu-probox.png',
      login: 'assets/images/logo/logo_probox_one_full.png',
      main: 'assets/images/logo/logo_probox_one_full.png',
      header: 'assets/images/logo/logo_probox_one_full.png',
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
    url: '/app/Smart-BOT/',
  },
};
