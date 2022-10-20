import { getUrlParams } from './utils';
import moment from 'moment';

// 订单数组
let orderListDataSource = [];
for (let i = 0; i < 13; i += 1) {
  orderListDataSource.push({
    key: i + 1,
    orderId: 'orderID-' + (i + 1),
    customer: '客户-' + (i + 1),
    lastModifiedAt: new Date(`2017-12-${Math.floor(i / 2) + 1}`),
    lastModifiedBy: 'admin',
    status: Math.floor(Math.random() * 5) % 5,
    deleted: 0,
  });
}
// 获取所有订单
export function getOrders(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...orderListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  dataSource = dataSource.filter(data => data.deleted === 0);

  if (params.orderId) {
    dataSource = dataSource.filter(data => data.orderId.indexOf(params.orderId) > -1);
  }

  if (params.customer) {
    dataSource = dataSource.filter(data => data.customer.indexOf(params.customer) > -1);
  }

  if (params.lastModifiedAt) {
    dataSource = dataSource.filter(data => moment(data.lastModifiedAt).format('YYYY-MM-DD') === moment(new Date(parseInt(params.lastModifiedAt, 10))).format('YYYY-MM-DD'));
  }

  if (params.lastModifiedBy) {
    dataSource = dataSource.filter(data => data.lastModifiedBy.indexOf(params.lastModifiedBy) > -1);
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getOrder(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...orderListDataSource];

  dataSource = dataSource.filter(data => parseInt(data.key, 10) === parseInt(params.key, 10))

  console.log(`${dataSource[0].key} -- ${dataSource[0].customer}`);

  let result = {};
  if(dataSource.length > 0){
    result = {
      status: 'ok',
      order: dataSource[0],
    };
  }else{
    result = {
      status: 'error',
      msg: 'empty',
    }
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

// 新建订单
export function postOrder(req, res, u, b) {
  console.log(`add order.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { customer } = body;
  const i = Math.ceil(Math.random() * 10000);
  orderListDataSource.unshift({
    key: i,
    orderId: 'orderID-' + (i + 1),
    customer: customer,
    lastModifiedAt: new Date(),
    lastModifiedBy: 'admin',
    status: 1,
  });

  if (res && res.json) {
    res.json({
      status: 'ok'
    });
  } else {
    return result;
  }
}
// 删除订单
export function deleteOrders(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
export function deleteOrder(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
// 修改订单
export function putOrders(req, res, u, b){
  console.log(`update orders.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const orders = body;

  orderListDataSource.forEach((oldOrder) => {
    orders.forEach((order) => {
      if(order.key === oldOrder.key){
        if(order.customer !== undefined) oldOrder.customer = order.customer;
        if(order.status !== undefined) oldOrder.status = order.status;
        if(order.deleted !== undefined) oldOrder.deleted = order.deleted;
        oldOrder.lastModifiedAt = new Date();
      }
    });
  });

  if (res && res.json) {
    res.json({
      status: 'ok'
    });
  } else {
    return result;
  }
}

export function putOrder(req, res, u, b){
  console.log(`update order.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const order = body;

  orderListDataSource.forEach(oldOrder => {
    if(order.key === oldOrder.key){
      if(order.customer !== undefined) oldOrder.customer = order.customer;
      if(order.status !== undefined) oldOrder.status = order.status;
      if(order.deleted !== undefined) oldOrder.deleted = order.deleted;
      oldOrder.lastModifiedAt = new Date();
    }
  });

  if (res && res.json) {
    res.json({
      status: 'ok'
    });
  } else {
    return result;
  }
}
