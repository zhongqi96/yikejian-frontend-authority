const menuData = [{
  name: 'Dashboard',
  icon: 'dashboard',
  path: 'dashboard',
  children: [{
    name: '工作台',
    path: 'workplace',
  }, {
    name: '分析页',
    path: 'analysis',
    role: ['admin'],
  }],
}, {
  name: '订单管理',
  icon: 'file',
  path: 'order',
  children: [{
    name: '订单列表',
    icon: 'file-text',
    path: 'list',
  }, {
    name: '创建订单',
    icon: 'file-add',
    path: 'form',
  }, {
    name: '订单详情',
    icon: 'file-add',
    path: 'profile',
    hideInMenu: true,
  }],
}, {
  name: '会员管理',
  icon: 'user',
  path: 'customer',
  children: [{
    name: '会员列表',
    icon: 'team',
    path: 'list',
  }, {
    name: '等级列表',
    icon: 'trophy',
    path: 'title/list',
  }
  ]
}, {
  name: '信息管理',
  icon: 'info-circle',
  path: 'info',
  children: [{
    name: '店铺管理',
    icon: 'shop',
    path: 'store/list',
  }, {
    name: '产品管理',
    icon: 'laptop',
    path: 'product/list',
  }, {
    name: '编辑产品',
    icon: 'laptop',
    path: 'product/edit',
    hideInMenu: true,
  }, {
    name: '礼品卡管理',
    icon: 'gift',
    path: 'gift/list',
    hideInMenu: true,
  }, {
    name: '优惠券管理',
    icon: 'tag',
    path: 'coupon/list',
    hideInMenu: true,
  },
],
}, {
  name: '系统管理',
  icon: 'setting',
  path: 'sys',
  // role: ['SYSTEM'],
  children: [{
    name: '用户管理',
    icon: 'user-add',
    path: 'user/list',
    role: ['USER_READ'],
  }, {
    name: '角色管理',
    icon: 'usergroup-add',
    path: 'role/list',
    role: ['ROLE_READ'],
  }, {
    name: '用户操作日志查询',
    icon: 'table',
    path: 'userlog/list',
    role: ['LOG_READ'],
  }],
}, {
  name: '账户',
  icon: 'user',
  path: 'user',
  role: ['guest'],
  children: [{
    name: '登录',
    path: 'login',
  }],
}, {
  name: '一刻间后台管理系统使用手册',
  icon: 'book',
  path: '#',
  target: '_blank',
}];

function formatter(data, parentPath = '', parentRole) {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        role: item.role || parentRole,
        children: formatter(item.children, `${parentPath}${item.path}/`, item.role),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        role: item.role || parentRole,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData);
