import { getUrlParams } from './utils';

let userLogListDataSource = [];
for (let i = 0; i < 123; i += 1) {
  userLogListDataSource.push({
    key: i,
    user: 'Jim Green',
    operation: 'add a user.',
    operatedAt: new Date(`2017-12-${Math.floor(i / 2) + 1}`),
  });
}

export function getUserLogList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...userLogListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.user) {
    dataSource = dataSource.filter(data => data.user.indexOf(params.user) > -1);
  }

  if (params.operation) {
    dataSource = dataSource.filter(data => data.operation.indexOf(params.operation) > -1);
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
