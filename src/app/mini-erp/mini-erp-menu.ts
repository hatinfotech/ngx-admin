import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Employees',
    icon: 'people-outline',
    link: '/mini-erp/human-resource/employees/list',
    home: true,
  },
  {
    title: 'Test component',
    icon: 'people-outline',
    link: '/mini-erp/test/dialog',
    home: true,
  },
  {
    title: 'Test dialog',
    icon: 'people-outline',
    link: '/mini-erp/test2/demo1',
    home: true,
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Logout',
        link: '/mini-erp/auth/logout',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
  {
    title: 'Demo',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard',
    home: true,
  },
];
