import { getUrlParams } from './utils';
import moment from 'moment';

// 优惠券数组
let couponListDataSource = [];
for (let i = 0; i < 13; i += 1) {
  couponListDataSource.push({
    key: i + 1,
    name: '优惠券-' + (i + 1),
    lastModifiedAt: new Date(`2017-12-${Math.floor(i / 2) + 1}`),
    lastModifiedBy: 'admin',
    status: Math.floor(Math.random() * 2) % 2,
    deleted: 0,
  });
}
// 获取所有优惠券
export function getCoupons(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...couponListDataSource];

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

export function getCoupon(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...couponListDataSource];

  dataSource = dataSource.filter(data => parseInt(data.key, 10) === parseInt(params.key, 10))

  console.log(`${dataSource[0].key} -- ${dataSource[0].name}`);

  let result = {};
  if(dataSource.length > 0){
    result = {
      status: 'ok',
      coupon: dataSource[0],
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

// 新建优惠券
export function postCoupon(req, res, u, b) {
  console.log(`add coupon.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name } = body;
  const i = Math.ceil(Math.random() * 10000);
  couponListDataSource.unshift({
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
// 删除优惠券
export function deleteCoupons(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
export function deleteCoupon(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
// 修改优惠券
export function putCoupons(req, res, u, b){
  console.log(`update coupons.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const coupons = body;

  couponListDataSource.forEach((oldCoupon) => {
    coupons.forEach((coupon) => {
      if(coupon.key === oldCoupon.key){
        if(coupon.name !== undefined) oldCoupon.name = coupon.name;
        if(coupon.status !== undefined) oldCoupon.status = coupon.status;
        if(coupon.deleted !== undefined) oldCoupon.deleted = coupon.deleted;
        oldCoupon.lastModifiedAt = new Date();
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

export function putCoupon(req, res, u, b){
  console.log(`update coupon.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const coupon = body;

  couponListDataSource.forEach(oldCoupon => {
    if(coupon.key === oldCoupon.key){
      if(coupon.name !== undefined) oldCoupon.name = coupon.name;
      if(coupon.status !== undefined) oldCoupon.status = coupon.status;
      if(coupon.deleted !== undefined) oldCoupon.deleted = coupon.deleted;
      oldCoupon.lastModifiedAt = new Date();
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
