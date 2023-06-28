 /**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { environment as prodenv } from './environment.prod';

export const environment = {
  ...prodenv,
  hmr: false,
  production: false,
  version: prodenv.version + '.dev',
  api: {
    // baseUrl: '/v1', // prod
    baseUrl: 'http://local.probox.vn/v3',
  },
  localApp: {
    // enabled: true, // prod
    enabled: false,
    url: 'http://localhost:8100',
  },
  proboxApp: {
    deepLink: 'http://localhost:8200',
  },
};

// export const environmentx = {
//   // Version structure s.m.f.b.e : Upgrade system . Add module . Add feature . Build of upgrade/update . Environment
//   version: '2.0.5.15.dev',
//   production: false,
//   hmr: false,
//   basePath: 'probox-one',
//   bundleId: 'com.namsoftware.probox-web-gui',
//   register: {
//     logo: {
//       voucher: 'assets/images/logo/logo-dang-ky-nhan-hieu-probox.png',
//       login: 'assets/images/logo/logo_probox_one.png',
//       main: 'assets/images/logo/logo_probox_one.png',
//       header: 'assets/images/logo/logo_probox_one.png',
//     },
//   },
//   api: {
//     // baseUrl: '/v1', // prod
//     baseUrl: 'http://local.probox.vn/v1',
//   },
//   number: {
//     // replace by system locale
//     thousandSeparator: ',',
//   },
//   localApp: {
//     // enabled: true, // prod
//     enabled: false,
//     url: 'http://localhost:8100',
//   },
//   firebase: {
//     apiKey: "AIzaSyCqLj9QQ0KUuLackTP-GTBrKL6byBaCz54",
//     authDomain: "smart-bot-7e8ca.firebaseapp.com",
//     databaseURL: "https://smart-bot-7e8ca.firebaseio.com",
//     projectId: "smart-bot-7e8ca",
//     storageBucket: "smart-bot-7e8ca.appspot.com",
//     messagingSenderId: "316262946834",
//     appId: "1:316262946834:web:f8e595eb803da324ce20cb",
//     measurementId: "G-1KP1VJ8804"
//   },
// };
