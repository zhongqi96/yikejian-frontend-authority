import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    // '/dashboard/monitor': {
    //   component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    // },
    // '/dashboard/workplace': {
    //   component: dynamicWrapper(app, ['task', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // role: ['admin'],
    // },
    // '/dashboard/dashboard': {
    //   component: dynamicWrapper(app, ['user'], () => import('../routes/Dashboard')),
    // },
    // '/form/basic-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    // },
    // '/form/step-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    // },
    // '/form/step-form/confirm': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    // },
    // '/form/step-form/result': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    // },
    // '/form/advanced-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    // },
    // '/list/table-list': {
    //   component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    // },
    // '/list/basic-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    // },
    // '/list/card-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    // },
    // '/list/search': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    // },
    // '/list/search/projects': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    // },
    // '/list/search/applications': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    // },
    // '/list/search/articles': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    // },
    // '/profile/basic': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    // },
    // '/profile/advanced': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
    // },
    // '/result/success': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    // },
    // '/result/fail': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    // },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },

    // my
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['task', 'user'], () => import('../routes/Dashboard/Workplace')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/info/store/list': {
      component: dynamicWrapper(app, ['store', 'inventory'], () => import('../routes/List/StoreList')),
    },
    '/info/store/form': {
      component: dynamicWrapper(app, ['store'], () => import('../routes/Forms/StoreForm')),
    },
    '/info/store/profile': {
      component: dynamicWrapper(app, ['inventory'], () => import('../routes/Profile/StoreProfile')),
    },
    '/info/store/device': {
      component: dynamicWrapper(app, ['store'], () => import('../routes/Forms/DeviceForm')),
    },
    '/info/product/list': {
      component: dynamicWrapper(app, ['product'], () => import('../routes/List/ProductList')),
    },
    '/info/product/form': {
      component: dynamicWrapper(app, ['product'], () => import('../routes/Forms/ProductForm')),
    },
    // '/info/device/list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/DeviceList')),
    // },
    '/info/coupon/list': {
      component: dynamicWrapper(app, ['coupon'], () => import('../routes/List/CouponList')),
    },
    '/info/coupon/form': {
      component: dynamicWrapper(app, ['coupon'], () => import('../routes/Forms/CouponForm')),
    },
    '/info/gift/list': {
      component: dynamicWrapper(app, ['gift'], () => import('../routes/List/GiftList')),
    },
    '/info/gift/form': {
      component: dynamicWrapper(app, ['gift'], () => import('../routes/Forms/GiftForm')),
    },
    '/sys/user/list': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/List/UserList')),
    },
    '/sys/user/form': {
      component: dynamicWrapper(app, ['user', 'role'], () => import('../routes/Forms/UserForm')),
    },
    '/sys/userlog/list': {
      component: dynamicWrapper(app, ['userlog'], () => import('../routes/List/UserLogList')),
    },
    '/sys/role/list': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/List/RoleList')),
    },
    '/sys/role/form': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/Forms/RoleForm')),
    },
    '/order/list': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/List/OrderList')),
    },
    '/order/form': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Forms/OrderForm')),
    },
    '/order/profile': {
      component: dynamicWrapper(app, ['order', 'profile'], () => import('../routes/Profile/OrderProfile')),
    },
    '/task/list': {
      component: dynamicWrapper(app, ['task'], () => import('../routes/List/TaskList')),
    },
    '/customer/list': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/List/CustomerList')),
    },
    '/customer/form': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Forms/CustomerForm')),
    },
    '/customer/title/list': {
      component: dynamicWrapper(app, ['title'], () => import('../routes/List/TitleList')),
    },
    '/customer/title/form': {
      component: dynamicWrapper(app, ['title'], () => import('../routes/Forms/TitleForm')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      role: routerConfig[item].role || menuItem.role,
    };
  });
  return routerData;
};
