import { getUrlParams } from './utils';

const status = ['0', '1', '2'];

let taskListDataSource = [];
for (let i = 0; i < 30; i += 1) {
  taskListDataSource.push({
    key: i,
    orderId: 'order-' + i,
    customer: 'customer-' + i,
    product: 'product-' + i,
    status: status[i % 3],
    startedAt: new Date(),
    duration: i % 3 === 0 ? 0 : i % 3 === 1 ? i : 30,
    progress: i % 3 === 0 ? 0 : i % 3 === 1 ? Math.floor(i / 30 * 100) : 100,
  });
}

export function getTaskList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...taskListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.orderId) {
    dataSource = dataSource.filter(data => data.orderId.indexOf(params.orderId) > -1);
  }

  if (params.customer) {
    dataSource = dataSource.filter(data => data.customer.indexOf(params.customer) > -1);
  }

  if (params.status) {
    dataSource = dataSource.filter(data => data.status.indexOf(params.status) > -1);
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

export function getTaskNum(){
  return {
    all: 56,
    finish: 16,
    running: 10,
  };
}
