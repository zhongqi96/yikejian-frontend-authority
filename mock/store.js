import { getUrlParams } from './utils';

const storeListDataSource = [
  {
    id: 1,
    avatar: '',
    title: '店铺1',
    description: '店铺1',
  }, {
    id: 2,
    avatar: '',
    title: '店铺2',
    description: '店铺2'
  }, {
    id: 3,
    avatar: '',
    title: '店铺3',
    description: '按摩店铺3很舒服'
  }
];

export function getStoreList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  if (res && res.json) {
    res.json(storeListDataSource);
  } else {
    return result;
  }
}

export function postStore(req, res) {
  res.send({ message: 'ok' });
}
