import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // Summary Dashboard
  {
    title: 'Dashboard',
    icon: 'monitor-outline',
    link: '/dashboard',
  },
  // IoT Dashboard
  {
    title: 'IoT Dashboard',
    icon: 'home-outline',
    link: '/iot-dashboard',
  },
  // Interagtion
  {
    title: 'Tích hợp',
    group: true,
  },
  {
    title: 'Tổng Đài Điện Toán',
    icon: 'phone-call-outline',
    children: [
      {
        title: 'Dashboard',
        // icon: 'people-outline',
        link: '/ivoip/dashboard',
      },
      {
        title: 'Tổng đài',
        // icon: 'people-outline',
        link: '/ivoip/pbxs/list',
      },
      {
        title: 'Domain',
        // icon: 'people-outline',
        link: '/ivoip/domains/list',
      },
      {
        title: 'Số mở rộng',
        // icon: 'people-outline',
        link: '/ivoip/extensions/list',
      },
      {
        title: 'Điện thoại IP',
        // icon: 'people-outline',
        link: '/ivoip/devices/list',
      },
      {
        title: 'Số đấu nối',
        // icon: 'people-outline',
        link: '/ivoip/pstn-numbers',
      },
      {
        title: 'Lịch sử cuộc gọi',
        // icon: 'people-outline',
        link: '/ivoip/cdr',
      },
      {
        title: 'Chặn số',
        // icon: 'people-outline',
        link: '/ivoip/call-blocks/list',
      },
    ],
  },
  {
    title: 'Wifi Marketing',
    icon: 'wifi-outline',
    children: [
      {
        title: 'Thông tin khách hàng',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Chương trình khuyến mãi',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Thống kê',
        // icon: 'people-outline',
        link: '/',
      },
    ],
  },
  // Software
  {
    title: 'Phần mềm',
    group: true,
  },
  {
    title: 'Bán hàng',
    icon: 'home-outline',
    children: [
      {
        title: 'Phiếu báo giá',
        // icon: 'people-outline',
        link: '/sales/price-report/list',
      },
      {
        title: 'Phiếu bán hàng',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Bảng giá',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Báo cáo',
        // icon: 'people-outline',
        link: '/',
      },
    ],
  },
  {
    title: 'Mua hàng',
    icon: 'shopping-cart-outline',
    children: [
      {
        title: 'Phiếu báo giá NCC',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Phiếu mua hàng',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Bảng giá NCC',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Báo cáo',
        // icon: 'people-outline',
        link: '/',
      },
    ],
  },
  {
    title: 'Kho bãi',
    icon: 'archive-outline',
    children: [
      {
        title: 'Phát sinh nhập/xuất',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Phiếu nhập kho',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Phiếu xuất kho',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Báo cáo',
        // icon: 'people-outline',
        link: '/',
      },
    ],
  },
  {
    title: 'Thu chi',
    icon: 'book-open-outline',
    children: [
      {
        title: 'Phát sinh thu/chi',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Phiếu thu',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Phiếu chi',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Báo cáo',
        // icon: 'people-outline',
        link: '/',
      },
    ],
  },
  {
    title: 'Nhân sự',
    icon: 'person-outline',
    children: [
      {
        title: 'Nhân viên',
        // icon: 'people-outline',
        link: '/human-resource/employees/list',
      },
      {
        title: 'Bộ phận',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Tên công việc',
        // icon: 'people-outline',
        link: '/',
      },
    ],
  },
  {
    title: 'Liên hệ',
    icon: 'book-outline',
    children: [
      {
        title: 'Khách hàng',
        // icon: 'people-outline',
        link: '/',
      },
      {
        title: 'Nhà cung cấp',
        // icon: 'people-outline',
        link: '/',
      },
    ],
  },
  // System
  {
    title: 'Hệ thống',
    group: true,
  },
  {
    title: 'Người dùng',
    icon: 'person-outline',
    children: [
      {
        title: 'Quản lý người dùng',
        // icon: 'people-outline',
        link: '/users/user-manager/list',
        // link: '/tabs/users',
      },
      {
        title: 'Nhóm người dùng',
        // icon: 'people-outline',
        link: '/users/group/list',
      },
      {
        title: 'Phân quyền',
        // icon: 'people-outline',
        link: '/users/permission/grant',
      },
      {
        title: 'Chặn truy cập',
        // icon: 'people-outline',
        link: '/users/ban',
      },
    ],
  },
  {
    title: 'Modules',
    icon: 'cube-outline',
    children: [
      {
        title: 'Quản lý module',
        // icon: 'people-outline',
        link: '/modules/manager/list',
      },
    ],
  },
  {
    title: 'Menu',
    icon: 'menu-2-outline',
    children: [
      {
        title: 'Quản lý menu',
        // icon: 'people-outline',
        link: '/menu/manager/list',
        // link: '/tabs/menu',
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
    ],
  },
  // {
  //   title: 'Employees',
  //   icon: 'people-outline',
  //   link: '/human-resource/employees/list',
  //   home: true,
  // },
  // {
  //   title: 'Sales',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Price Report',
  //       // icon: 'people-outline',
  //       link: '/sales/price-report',
  //     },
  //     {
  //       title: 'Price Table',
  //       // icon: 'people-outline',
  //       link: '/sales/price-table',
  //     },
  //   ],
  // },
  // {
  //   title: 'Test group',
  //   group: true,
  // },
  // {
  //   title: 'Test',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Data table',
  //       // icon: 'people-outline',
  //       link: '/test/data-table',
  //     },
  //     {
  //       title: 'From',
  //       // icon: 'people-outline',
  //       link: '/test/form',
  //     },
  //   ],
  // },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Logout',
  //       link: '/auth/logout',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
  // {
  //   title: 'Demo',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
];
