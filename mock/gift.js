import { getUrlParams } from './utils';
import moment from 'moment';

// 礼品数组
let giftListDataSource = [];
for (let i = 0; i < 13; i += 1) {
  giftListDataSource.push({
    key: i + 1,
    name: '礼品-' + (i + 1),
    lastModifiedAt: new Date(`2017-12-${Math.floor(i / 2) + 1}`),
    lastModifiedBy: 'admin',
    status: Math.floor(Math.random() * 2) % 2,
    deleted: 0,
  });
}
// 获取所有礼品
export function getGifts(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...giftListDataSource];

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

export function getGift(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...giftListDataSource];

  dataSource = dataSource.filter(data => parseInt(data.key, 10) === parseInt(params.key, 10))

  console.log(`${dataSource[0].key} -- ${dataSource[0].name}`);

  let result = {};
  if(dataSource.length > 0){
    result = {
      status: 'ok',
      gift: dataSource[0],
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

// 新建礼品
export function postGift(req, res, u, b) {
  console.log(`add gift.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name } = body;
  const i = Math.ceil(Math.random() * 10000);
  giftListDataSource.unshift({
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
// 删除礼品
export function deleteGifts(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
export function deleteGift(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
// 修改礼品
export function putGifts(req, res, u, b){
  console.log(`update gifts.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const gifts = body;

  giftListDataSource.forEach((oldGift) => {
    gifts.forEach((gift) => {
      if(gift.key === oldGift.key){
        if(gift.name !== undefined) oldGift.name = gift.name;
        if(gift.status !== undefined) oldGift.status = gift.status;
        if(gift.deleted !== undefined) oldGift.deleted = gift.deleted;
        oldGift.lastModifiedAt = new Date();
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

export function putGift(req, res, u, b){
  console.log(`update gift.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const gift = body;

  giftListDataSource.forEach(oldGift => {
    if(gift.key === oldGift.key){
      if(gift.name !== undefined) oldGift.name = gift.name;
      if(gift.status !== undefined) oldGift.status = gift.status;
      if(gift.deleted !== undefined) oldGift.deleted = gift.deleted;
      oldGift.lastModifiedAt = new Date();
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
