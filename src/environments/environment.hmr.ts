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
  version: '1.0.3.36.dev',
  production: false,
  hmr: true,
  basePath: 'mini-erp',
  register: {
    logo: {
      voucher: 'assets/images/logo/probox-voucher-logo.png',
    },
  },
  api: {
    // baseUrl: '/v1', // prod
    baseUrl: 'https://develop.namsoftware.com/v1',
  },
  number: {
    // replace by system locale
    thousandSeparator: ',',
  },
  localApp: {
    // enabled: true, // prod
    enabled: false,
    url: '/app/ITLocal/index.html',
  },
};
