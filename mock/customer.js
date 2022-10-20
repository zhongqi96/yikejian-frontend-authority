import { getUrlParams } from './utils';
import moment from 'moment';

// 会员数组
let customerListDataSource = [];
for (let i = 0; i < 13; i += 1) {
  customerListDataSource.push({
    key: i + 1,
    name: '会员-' + (i + 1),
    lastModifiedAt: new Date(`2017-12-${Math.floor(i / 2) + 1}`),
    lastModifiedBy: 'admin',
    status: Math.floor(Math.random() * 2) % 2,
    deleted: 0,
  });
}
// 获取所有会员
export function getCustomers(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...customerListDataSource];

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

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  if (params.lastModifiedAt) {
    dataSource = dataSource.filter(data => data.lastModifiedAt > params.lastModifiedAt);
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

export function getCustomer(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...customerListDataSource];

  dataSource = dataSource.filter(data => parseInt(data.key, 10) === parseInt(params.key, 10))

  console.log(`${dataSource[0].key} -- ${dataSource[0].name}`);

  let result = {};
  if(dataSource.length > 0){
    result = {
      status: 'ok',
      customer: dataSource[0],
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

// 新建会员
export function postCustomer(req, res, u, b) {
  console.log(`add customer.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name } = body;
  const i = Math.ceil(Math.random() * 10000);
  customerListDataSource.unshift({
    key: i,
    name: name,
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
// 删除会员
export function deleteCustomers(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
export function deleteCustomer(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
// 修改会员
export function putCustomers(req, res, u, b){
  console.log(`update customers.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const customers = body;

  customerListDataSource.forEach((oldCustomer) => {
    customers.forEach((customer) => {
      if(customer.key === oldCustomer.key){
        if(customer.name !== undefined) oldCustomer.name = customer.name;
        if(customer.status !== undefined) oldCustomer.status = customer.status;
        if(customer.deleted !== undefined) oldCustomer.deleted = customer.deleted;
        oldCustomer.lastModifiedAt = new Date();
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

export function putCustomer(req, res, u, b){
  console.log(`update customer.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const customer = body;

  customerListDataSource.forEach(oldCustomer => {
    if(customer.key === oldCustomer.key){
      if(customer.name !== undefined) oldCustomer.name = customer.name;
      if(customer.status !== undefined) oldCustomer.status = customer.status;
      if(customer.deleted !== undefined) oldCustomer.deleted = customer.deleted;
      oldCustomer.lastModifiedAt = new Date();
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
