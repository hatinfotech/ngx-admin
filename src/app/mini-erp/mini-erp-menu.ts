import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Employees',
    icon: 'people-outline',
    link: '/human-resource/employees/list',
    home: true,
  },
  {
    title: 'Test',
    icon: 'lock-outline',
    children: [
      {
        title: 'Data table',
        icon: 'people-outline',
        link: '/test/data-table',
      },
      {
        title: 'From',
        icon: 'people-outline',
        link: '/test/form',
      },
    ],
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
        link: '/auth/logout',
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
