/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  // Version structure s.m.f.b.e: Upgrade system . Add/Update module . Add/update feature . Build of upgrade/update/hotfix . Environment
  // version: '6.5.0.1',
  version: '6.12.2.2',
  // 6.12.2.1:   demo authorized sale voucher
  // 6.12.1.1:   demo sale by commission voucher
  // 6.12.0.1:   Allow config setting for module and feature anywhere
  // 6.11.0.1:   production order v1 demo
  // 6.10.0.1:   sales processing: Price quotation > Goods Delivery > Sales > Receipt demo 1
  // 6.10.0.2:   replace probox.center by probox.vn
  // 6.10.0.1:   sales processing
  // 6.9.6.2:   hotupdate: discount table
  // 6.9.6.1:   hotupdate: b2b quotation
  // 6.9.5.8:   accounting: fix debt report: sum of revenue not matched
  // 6.9.5.3:   collaborator dev v3: kpi: award voucher demo: statistics and load preview data to form
  // 6.9.5.1:   collaborator dev v3: kpi: statistics strategy and distrbuted contract
  // 6.9.4.1:   hotupdate: add Thread field and write voucher with thread
  // 6.9.3.7:   collaborator dev v3: fix assign manager for publisher
  // 6.9.3.7:   collaborator dev v3: fix main menu and list reset function
  // 6.9.3.7:   collaborator dev v3: update some list using ag-grid
  // 6.9.3.4:   collaborator dev v3: statistics chart for order and revenue
  // 6.9.3:   collaborator dev v3: 
  // 6.9.2.3:   collaborator dev v3: load product form collaborator, load price in server, permission config
  // 6.9.2:   collaborator dev v3: auto cordinate to employee in relative group b2
  // 6.9.2:   collaborator dev v3: auto cordinate to employee in relative group
  // 6.9.1:   hotupdate marketing print member card feature
  // 6.9.0:   collaborator dev v3: rebuild book entry processing
  // 6.9:     collaborator dev v3
  // 6.8.2:   hotfix product inport
  // 6.8.1:   hotfix POS GUI: warning out of stock
  // 6.8.0:   member card v1
  // 6.7.5:   warehouse report from warehouse book
  // 6.7.4:   update product name by suplier product name, add revision feature and apply for product resource
  // 6.7.3:   hotfix sales voucher can not choose Accounting Business
  // 6.7.2:   update master price table processing
  // 6.7.1:   hotfix Purchase Order Form not load units for choose
  // 6.7:   warehouse report v2
  // 6.6:   sale master price table v2
  // 6.5.27:   upgrade purchase, sales, accouting, warehouse, pos, deployment list using new ag-grid
  // 6.5.26:   update warehosue: show inventory when choose container in form
  // 6.5.25:   hotfix goods delivery note form: not load unit list for edit case
  // 6.5.24:   hotupdate admin product list
  // 6.5.23:   hotfix: warehouse goods receipt note form not show all units for choosed
  // 6.5.22:   hotfix: users/profile
  // 6.5.21:   upgrade warehouse goods list using new ag-grid
  // 6.5.20:   hostfix: Data Form Manager not set data for first create => Code null on next save
  // 6.5.19:   Fix inventory adjust form new using ag-grid
  // 6.5.18:   fix import product using new ag-grid
  // 6.5.17.1:   Upgrade product list using ag-grid 
  // 6.5.16:   hotfix: ProBox One auto deploy feature
  // 6.5.15:   purchase order: auto choose business
  // 6.5.14:   apply ag-grid for accounting report detail by object
  // 6.5.13:   updat goods receipt note print
  // 6.5.12:   dev new list use ag-grid library
  // 6.5.10:   update warehosue export for distribution case
  // 6.5.9.5:   update sale price form
  // 6.5.9.2:   import purchase detail from supplier price quotation v2: Using purchase product map for detect product
  // 6.5.9.1:   import purchase detail from supplier price quotation
  // 6.5.8.1:   update wp sync: remove not sync product in task detail before sync
  // 6.5.7.1:   add re-write feature for commerce post order
  // 6.5.6.3:   show ref categories by tree
  // 6.5.6.2:   sync wp product: allow delete dirty products
  // 6.5.6.1:   fix for testing 
  // 6.5.5.1:   hotfix update: sales-product
  // 6.5.4.1:   hotfix module Service by cycle
  // 6.5.3.2:   POS: fix return voucher payment
  // 6.5.3.1:   POS: new barcode processing queue
  // 6.5.2.1:   wp-order-processing-v1: clone from collaborator processing
  // 6.5.2.1:   wp-order-processing-v1: clone from collaborator processing
  // 6.5.1.4:   wordpress-webhoook-v1: manual pull wp orders
  // 6.5.1.3:   wordpress-webhoook-v1: dev order hook: new and update order event
  // 6.5.1.1:   wordpress-webhoook-v1: dev order webhook
  // 6.5.0.12:   wordpress-product-sync-v1: live update sync task details
  // 6.5.0.10:   wordpress-product-sync-v1: show SyncTime for sync task details
  // 6.5.0.9:   wordpress-product-sync-v1: fix load ref categories
  // 6.5.0.8:   wordpress-product-sync-v1: fix load ref categories
  // 6.5.0.7:   wordpress-product-sync-v1: fix can not scroll after clear worksite
  // 6.5.0.6:   wordpress-product-sync-v1: fix can not scroll after clear worksite
  // 6.5.0.5:   wordpress-product-sync-v1: update regular price and discount price
  // 6.5.0.4:   wordpress-product-sync-v1: fix reload ref categories when scroll
  // 6.5.0.3:   wordpress-product-sync-v1: algorithm v2 fix only sync available units, import base/first/all unit
  // 6.5.0.1:   wordpress-product-sync-v1: algorithm v1, wp product, price management
  // 6.4.0.4:   hotfix pos not add access number to detail
  // 6.5.0:   wordpress-product-sync-v1
  // 6.4.0.3:   fix pos search and check inventory
  // 6.4.0.2:   fix price not match with unit
  // 6.4.0.1:   Update POS Module: support multiple payment method
  // 6.3.2.2:   hotupdate speedup POS GUI init
  // 6.3.2.1:   search rank feature v1
  // 6.3.1.1:   server report progress feature v1
  // 6.2.19:   Update purchase process v2.1
  // 6.2.18:   api get with progress
  // 6.2.18:   POS: search show inventory
  // 6.2.17:   update relative voucher tags: show type info
  // 6.2.16:   update print label
  // 6.2.15.1:   support upload by link
  // 6.2.14.1:   dev auto collect purchase product info
  // 6.2.13.1:   dev export/import purchase order to/from excel
  // 6.2.12.1:   dev cash flow report and statistics
  // 6.2.11.1:   hotfix assign product categories, contra account report
  // 6.2.10.1:   Hotupdate: optimize report query
  // 6.2.9.2:   Hotupdate: re write order => goods receipt => purchase processing, payment relative to purchase order
  // 6.2.9.1:   Hotupdate: re write order => goods receipt => purchase processing
  // 6.2.8.1:   Hotupdate: fix pos auto update contact, fix dialog keyevent, dialog close by esc only top dialog
  // 6.2.7.13:   Hotupdate: fix import dialog: process one by one product row
  // 6.2.7.6:   Hotupdate: import product map form
  // 6.2.7.5:   Hotupdate: Update product info: brand, tags, properties
  // 6.2.7:   Hotupdate: Import products from excell
  // 6.2.6:   Hotupdate: POS Price Report, purchase deployment, employment debt report
  // 6.2.5:   Hotupdate: Warehouse delivery form update
  // 6.2.4:   Hotupdate: POS deployment writing to master book feature
  // 6.2.3:   Update access number tem
  // 6.2.2:   Update POS GUI: revert calcualte Price, await all promise complete on payment
  // 6.2.1:   Update acc report resource
  // 6.2.0:   Collaborator v2: basic, advance, addon, rebuy, commission form config and write to master book demo
  // 6.2.0:   Collaborator v2
  // 6.1.10.5:   purchase price statistics  
  // 6.1.10:   CommercePOS: load product from product search index
  // 6.1.9.7:   Hotfix warehouse goods list not show all unit for add new container
  // 6.1.9.2:   Fix barcode extract for outside product ip 
  // 6.1.9.1:   Update account report: increase amount column
  // 6.1.8.1:   Fix POS return feature
  // 6.1.7:   SystemUuid for detail resources 
  // 6.1.6:   book commited feature
  // 6.1.5.2:   warehouse: expired and out of stock report anh notification
  // 6.1.5:     Dev sale, purchase, warehouse dashboard
  // 6.1.4:     Update pos search offline data
  // 6.1.3:     Update cost of goods sold calculate
  // 6.1.2.1:   Dev adjust inventory feature and update Commerce POS: auto ajust inventory
  // 6.1.1.75:  Auto update master price table when had been changed
  // 6.1.1.48:  Update quick create new container for goods
  // 6.1.1.47:  Fix can not input quantity as float number
  // 6.1.1.44:  Update POS GUI
  // 6.1.1.39:  Fix lỗi thay đổi số truy xuất gốc thành số truy xuất không đúng cấu trúc do không nhận dạng được số truy xuất gốc khi cập nhật phiếu nhập 
  // 6.1.1.28:  Fix lỗi quan trong: lỗi update các trường detail trung id với detail của phiếu liên quan => các dữ liệu trước đó có thể bị sai nhưng dữ liệu đã ghi sổ thì vẫn đúng (số liệu ghi sổ sẽ bị sai nếu bỏ ghi và ghi lại)
  // 6.1.1:     Continue develop Commerce POS module, GUI and api
  // 6.1.0.8:   Assign product container in product list
  // 6.1.1.1:   Update warehouse module: manage by addcess number feature
  // 6.1.0.2:   Module Commerce POS
  // 6.0.12.4:  Fix print label for access number
  // 6.0.12.2:  Fix print label for access number
  // 6.0.12:    Add AccessNumber feature for warehouse
  // 6.0.11.3:  fix purchase voucher print
  // 6.0.11:    Support choose product from recent purchase order
  // 6.0.10:    Sales returns feature
  // 6.0.9:     Add photo browser feature
  // 6.0.8.5:   fix some error, update select2ajaxoption
  // 6.0.8:     fix some error
  // 6.0.7:     update warehouse v3: inventory adjust note r2
  // 6.0.7:     update warehouse v3: inventory adjust note
  // 6.0.6:     update tax feature
  // 6.0.4.4:   publisher create chat room from order and sync with core BM
  // 6.0.4.1:   dev multi core chat feature: add chat room member and connect/disconnect function
  // 6.0.3.2:   hotfix unit of vouchers
  // 6.0.3: dev multi core chat feature: base of technology
  // 6.0.2.7: Fix accounting statistics daskboard
  // 6.0.2: Update scan2login without socket
  // 6.0.1: Accounting report update: report from and to date, account detail report
  // 6.0: Working with api version v2
  // 5.0.12: Accounting statistics chart
  // 5.0.11: Accounting report update: cash flow report
  // 5.0.10: Fix auto refresh token loop
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
  basePath: 'probox-one',
  register: {
    logo: {
      voucher: 'assets/images/logo/logo-dang-ky-nhan-hieu-probox.png',
      login: 'assets/images/logo/logo_probox_one.png',
      main: 'assets/images/logo/logo_probox_one.png',
      header: 'assets/images/logo/logo_probox_one.png',
    },
  },
  api: {
    baseUrl: '/v3',
  },
  number: {
    // replace by system locale
    thousandSeparator: ',',
  },
  localApp: {
    enabled: false,
    url: '/app/Smart-BOT/',
  },
  proboxApp: {
    deepLink: 'https://probox.vn',
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
  defaultPrintFooter: 'Phiếu được in tại Phần mềm ProBox One - Phần mềm quản trị cộng tác viên chuyên sâu'
};
