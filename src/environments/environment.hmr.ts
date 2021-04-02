/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  // Version structure s.m.f.b.e : Upgrade system . Add module . Add feature . Build of upgrade/update . Environment
  version: '2.0.5.15.dev',
  // 2.0.1.0.dev : Develop helpdesl manager module
  production: false,
  hmr: true,
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
    // baseUrl: '/v1', // prod
    baseUrl: 'http://local.namsoftware.com/v1',
  },
  number: {
    // replace by system locale
    thousandSeparator: ',',
  },
  localApp: {
    // enabled: true, // prod
    enabled: false,
    url: 'http://localhost:8100',
  },
};
