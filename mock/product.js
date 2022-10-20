import { getUrlParams } from './utils';

const productListDataSource = [
  {
    id: 1,
    avatar: '',
    title: '小睡',
    description: '小睡很惬意',
  }, {
    id: 2,
    avatar: '',
    title: '按摩',
    description: '按摩很舒服'
  }
];

export function getProductList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  if (res && res.json) {
    res.json(productListDataSource);
  } else {
    return result;
  }
}

export function postProduct(req, res) {
  res.send({ message: 'ok' });
}
