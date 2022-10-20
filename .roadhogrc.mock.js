import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { postUser, deleteUsers, deleteUser, putUsers, putUser, getUsers, getUser, getCurrentUser, getToken } from './mock/user';
import { postRole, deleteRoles, deleteRole, putRoles, putRole, getRoles, getRole, getAuthorities } from './mock/role';
import { postOrder, deleteOrders, deleteOrder, putOrders, putOrder, getOrders, getOrder } from './mock/order';
import { postGift, deleteGifts, deleteGift, putGifts, putGift, getGifts, getGift } from './mock/gift';
import { postCoupon, deleteCoupons, deleteCoupon, putCoupons, putCoupon, getCoupons, getCoupon } from './mock/coupon';
import { postCustomer, deleteCustomers, deleteCustomer, putCustomers, putCustomer, getCustomers, getCustomer } from './mock/customer';
import { getUserLogList } from './mock/userlog';
import { getProductList, postProduct } from './mock/product';
import { getStoreList, postStore } from './mock/store';
import { getTaskList } from './mock/task';
import { format, delay } from 'roadhog-api-doc';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  // 'GET /api/currentUser': {
  //   $desc: "获取当前用户接口",
  //   $params: {
  //     pageSize: {
  //       desc: '分页',
  //       exp: 2,
  //     },
  //   },
  //   $body: {
  //     name: 'Serati Ma',
  //     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  //     userid: '00000001',
  //     notifyCount: 12,
  //   },
  // },
  // 'GET /api/currentUser': getCurrentUser,
  // GET POST 可省略
  // 'GET /api/users': [{
  //   key: 1,
  //   name: 'John Brown',
  //   age: 32,
  //   address: 'New York No. 1 Lake Park',
  //   role: 'admin',
  //   createdAt: new Date(new Date().getTime() - (1000 * 60 * 60 * 2 * 3)),
  //   status: '有效',
  // }, {
  //   key: 1,
  //   name: 'Jim Green',
  //   age: 42,
  //   address: 'London No. 1 Lake Park',
  //   role: 'user',
  //   createdAt: new Date(new Date().getTime() - (1000 * 60 * 60 * 2 * 20)),
  //   status: '有效',
  // }, {
  //   key: 3,
  //   name: 'Joe Black',
  //   age: 32,
  //   address: 'Sidney No. 1 Lake Park',
  //   role: 'user',
  //   createdAt: new Date(new Date().getTime() - (1000 * 60 * 60 * 2 * 50)),
  //   status: '无效',
  // }],
  // 'GET /api/users': getUserList,
  // 'POST /api/user': {
  //   $body: postUser,
  // },
  // 'GET /api/project/notice': getNotice,
  // 'GET /api/activities': getActivities,
  // 'GET /api/rule': getRule,
  // 'POST /api/rule': {
  //   $params: {
  //     pageSize: {
  //       desc: '分页',
  //       exp: 2,
  //     },
  //   },
  //   $body: postRule,
  // },
  // 'POST /api/forms': (req, res) => {
  //   res.send({ message: 'Ok' });
  // },
  // 'GET /api/tags': mockjs.mock({
  //   'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  // }),
  // 'GET /api/fake_list': getFakeList,
  // 'GET /api/fake_chart_data': getFakeChartData,
  // 'GET /api/profile/basic': getProfileBasicData,
  // 'GET /api/profile/advanced': getProfileAdvancedData,
  // 'POST /api/login/account': (req, res) => {
  //   const { password, userName, type } = req.body;
  //   if(password === '888888' && userName === 'admin'){
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentRole: 'admin',
  //       token: 'token-of-admin',
  //     });
  //     return ;
  //   }
  //   if(password === '123456' && userName === 'user'){
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentRole: 'user',
  //       token: 'token-of-user',
  //     });
  //     return ;
  //   }
  //   res.send({
  //     status: 'error',
  //     type,
  //     currentRole: 'guest',
  //   });
  // },
  // 'POST /api/register': (req, res) => {
  //   res.send({ status: 'ok', currentRole: 'user' });
  // },
  // 'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },

  'GET /api/userlogs': getUserLogList,
  'GET /api/products': getProductList,
  'POST /api/product': postProduct,
  'GET /api/stores': getStoreList,
  'POST /api/store': postStore,
  'GET /api/tasks': getTaskList,

  'POST /user-service/oauth/token': getToken,
  'POST /user-service/user': postUser,
  'DELETE /user-service/users': deleteUsers,
  'DELETE /user-service/user': deleteUser,
  'PUT /user-service/users': putUsers,
  'PUT /user-service/user': putUser,
  'GET /user-service/users': getUsers,
  'GET /user-service/user': getUser,
  'GET /user-service/currentUser': getCurrentUser,

  'POST /user-service/role': postRole,
  'DELETE /user-service/roles': deleteRoles,
  'DELETE /user-service/role': deleteRole,
  'PUT /user-service/roles': putRoles,
  'PUT /user-service/role': putRole,
  'GET /user-service/roles': getRoles,
  'GET /user-service/role': getRole,
  'GET /user-service/authorities': getAuthorities,

  'POST /order-service/order': postOrder,
  'DELETE /order-service/orders': deleteOrders,
  'DELETE /order-service/order': deleteOrder,
  'PUT /order-service/orders': putOrders,
  'PUT /order-service/order': putOrder,
  'GET /order-service/orders': getOrders,
  'GET /order-service/order': getOrder,

  'POST /customer-service/customer': postCustomer,
  'DELETE /customer-service/customers': deleteCustomers,
  'DELETE /customer-service/customer': deleteCustomer,
  'PUT /customer-service/customers': putCustomers,
  'PUT /customer-service/customer': putCustomer,
  'GET /customer-service/customers': getCustomers,
  'GET /customer-service/customer': getCustomer,

  'POST /gift-service/gift': postGift,
  'DELETE /gift-service/gifts': deleteGifts,
  'DELETE /gift-service/gift': deleteGift,
  'PUT /gift-service/gifts': putGifts,
  'PUT /gift-service/gift': putGift,
  'GET /gift-service/gifts': getGifts,
  'GET /gift-service/gift': getGift,

  'POST /coupon-service/coupon': postCoupon,
  'DELETE /coupon-service/coupons': deleteCoupons,
  'DELETE /coupon-service/coupon': deleteCoupon,
  'PUT /coupon-service/coupons': putCoupons,
  'PUT /coupon-service/coupon': putCoupon,
  'GET /coupon-service/coupons': getCoupons,
  'GET /coupon-service/coupon': getCoupon,

};

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// export default noProxy ? {} : delay(proxy, 1000);
export default {
  // 'GET /user-service/(.*)': 'http://192.168.1.101:8001/user-service',
  // 'POST /user-service/(.*)': 'http://192.168.1.101:8001/user-service',
  // 'PUT /user-service/(.*)': 'http://192.168.1.101:8001/user-service',
  // 'GET /customer-service/(.*)': 'http://192.168.1.101:8002/customer-service',
  // 'POST /customer-service/(.*)': 'http://192.168.1.101:8002/customer-service',
  // 'PUT /customer-service/(.*)': 'http://192.168.1.101:8002/customer-service',
  // 'GET /product-service/(.*)': 'http://192.168.1.101:8004/product-service',
  // 'POST /product-service/(.*)': 'http://192.168.1.101:8004/product-service',
  // 'PUT /product-service/(.*)': 'http://192.168.1.101:8004/product-service',
  // 'GET /store-service/(.*)': 'http://192.168.1.101:8003/store-service',
  // 'POST /store-service/(.*)': 'http://192.168.1.101:8003/store-service',
  // 'PUT /store-service/(.*)': 'http://192.168.1.101:8003/store-service',
  // 'GET /order-service/(.*)': 'http://192.168.1.101:8006/order-service',
  // 'POST /order-service/(.*)': 'http://192.168.1.101:8006/order-service',
  // 'PUT /order-service/(.*)': 'http://192.168.1.101:8006/order-service',
  // 'GET /inventory-service/(.*)': 'http://192.168.1.101:8005/inventory-service',
  // 'POST /inventory-service/(.*)': 'http://192.168.1.101:8005/inventory-service',
  // 'PUT /inventory-service/(.*)': 'http://192.168.1.101:8005/inventory-service',

  'GET /user-service/(.*)': 'http://localhost:8001/user-service',
  'POST /user-service/(.*)': 'http://localhost:8001/user-service',
  'PUT /user-service/(.*)': 'http://localhost:8001/user-service',
  'GET /customer-service/(.*)': 'http://localhost:8002/customer-service',
  'POST /customer-service/(.*)': 'http://localhost:8002/customer-service',
  'PUT /customer-service/(.*)': 'http://localhost:8002/customer-service',
  'GET /product-service/(.*)': 'http://localhost:8004/product-service',
  'POST /product-service/(.*)': 'http://localhost:8004/product-service',
  'PUT /product-service/(.*)': 'http://localhost:8004/product-service',
  'GET /store-service/(.*)': 'http://localhost:8003/store-service',
  'POST /store-service/(.*)': 'http://localhost:8003/store-service',
  'PUT /store-service/(.*)': 'http://localhost:8003/store-service',
  'GET /order-service/(.*)': 'http://localhost:8006/order-service',
  'POST /order-service/(.*)': 'http://localhost:8006/order-service',
  'PUT /order-service/(.*)': 'http://localhost:8006/order-service',
  'GET /inventory-service/(.*)': 'http://localhost:8005/inventory-service',
  'POST /inventory-service/(.*)': 'http://localhost:8005/inventory-service',
  'PUT /inventory-service/(.*)': 'http://localhost:8005/inventory-service',
};
