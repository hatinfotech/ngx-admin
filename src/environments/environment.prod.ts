/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  // Version structure s.m.f.b.e: Upgrade system . Add/Update module . Add/update feature . Build of upgrade/update . Environment
  version: '5.0.9.28',
  // 5.0.9.4: Hot update accounting summary and detail debt report, hotfix select2 loop on change value
  // 5.0.9: Collaborator education article
  // 5.0.8: collaborator dashboard chart
  // 5.0.7: update UI/UX
  // 5.0.6: publishers and products revenue report
  // 5.0.5: collaborator telesale processing
  // 5.0.4.2: update accounting report by date
  // 5.0.3: collaborator sales processing
  // 5.0.2.1: redefined voucher state
  // 5.0.1.1: redev Calculate collaborator commission and award
  // 5.0: Upgrade ngx-admin 8, angular 12
  // 4.0.2.1: Add KPI config for collaborator > product
  // 4.0.1.1: Update CKeditor support upload image to file store, support more toolbar: image style, image resize,...
  // 3.0.0: Upgrade: support multi core connection
  // 2.3.10: Dev Commerce service by cycle module
  // 2.3.9: Complete commerce process
  // 2.3.8: Update MiniErp Auto Update Management feature
  // 2.3.7: Complete commerce process
  // 2.3.6: Update warehouse module
  // 2.3.5: Update purchase module
  // 2.3.4: Update accouting module
  // 2.3.3.2: Fix price report dubble load details
  // 2.3.3: Update price report: restricted field
  // 2.3.2: Zalo Connect with Parallel App
  // 2.3.1: Zalo OA Config GUI
  // 2.3.0: Commerical process
  // 2.2.1.1: Develop notificaiton service
  // 2.2.0.17: Fix price price report form error detail Product null
  // 2.2.0.16: Update product picture support for price report
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
  bundleId: 'com.namsoftware.probox-web-gui',
  hmr: false,
  basePath: 'probox-core',
  register: {
    logo: {
      voucher: 'assets/images/logo/logo-dang-ky-nhan-hieu-probox.png',
      login: 'assets/images/logo/logo_probox_one.png',
      main: 'assets/images/logo/logo_probox_one.png',
      header: 'assets/images/logo/logo_probox_one.png',
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
  firebase: {
    apiKey: "AIzaSyCqLj9QQ0KUuLackTP-GTBrKL6byBaCz54",
    authDomain: "smart-bot-7e8ca.firebaseapp.com",
    databaseURL: "https://smart-bot-7e8ca.firebaseio.com",
    projectId: "smart-bot-7e8ca",
    storageBucket: "smart-bot-7e8ca.appspot.com",
    messagingSenderId: "316262946834",
    appId: "1:316262946834:web:f8e595eb803da324ce20cb",
    measurementId: "G-1KP1VJ8804"
  },
};
