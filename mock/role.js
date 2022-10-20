import { getUrlParams } from './utils';

// 权限数组
const authorities = [
  {
    code: 'sys',
    name: '系统管理',
  },
  {
    code: 'info',
    name: '信息管理',
  },
  {
    code: 'order',
    name: '订单管理',
  },
  {
    code: 'customer',
    name: '会员管理',
  },
  {
    code: 'work',
    name: '工作台',
  },
  {
    code: 'analyze',
    name: '分析',
  }
];
// 获取权限
export function getAuthorities(req, res){
  res.json(authorities);
}

// 角色数组
let roleListDataSource = [];
for (let i = 0; i < 13; i += 1) {
  roleListDataSource.push({
    key: i + 1,
    name: '角色-' + (i + 1),
    authorities: [authorities[i % 6].code, authorities[(i + 1) % 6].code],
    lastModifiedAt: new Date(`2017-12-${Math.floor(i / 2) + 1}`),
    lastModifiedBy: 'admin',
    status: Math.floor(Math.random() * 2) % 2,
    deleted: 0,
  });
}
// 获取所有角色
export function getRoles(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...roleListDataSource];

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

  if (params.authority) {
    dataSource = dataSource.filter(data => data.authorities.filter(authority => authority === params.authority).length > 0);
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

export function getRole(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...roleListDataSource];

  dataSource = dataSource.filter(data => parseInt(data.key, 10) === parseInt(params.key, 10))

  console.log(`${dataSource[0].key} -- ${dataSource[0].name} -- ${dataSource[0].authorities}`);

  let result = {};
  if(dataSource.length > 0){
    result = {
      status: 'ok',
      role: dataSource[0],
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

// 新建角色
export function postRole(req, res, u, b) {
  console.log(`add role.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name, authorities } = body;
  const i = Math.ceil(Math.random() * 10000);
  roleListDataSource.unshift({
    key: i,
    name: name,
    authorities: authorities,
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
// 删除角色
export function deleteRoles(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
export function deleteRole(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
// 修改角色
export function putRoles(req, res, u, b){
  console.log(`update roles.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const roles = body;

  roleListDataSource.forEach((oldRole) => {
    roles.forEach((role) => {
      if(role.key === oldRole.key){
        // oldRole.status = role.status;
        // oldRole = {...oldRole, ...role};
        // const index = roleListDataSource.indexOf(oldRole);
        // roleListDataSource.splice(index, 1, {...oldRole, ...role});
        // roleListDataSource.remove(oldRole);
        // roleListDataSource.push({...oldRole, ...role});
        if(role.name !== undefined) oldRole.name = role.name;
        if(role.authorities !== undefined) oldRole.authorities = role.authorities;
        if(role.status !== undefined) oldRole.status = role.status;
        if(role.deleted !== undefined) oldRole.deleted = role.deleted;
        oldRole.lastModifiedAt = new Date();
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

export function putRole(req, res, u, b){
  console.log(`update role.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const role = body;

  roleListDataSource.forEach(oldRole => {
    if(role.key === oldRole.key){
      // console.log(role);
      // console.log(oldRole);
      // oldRole = {...oldRole, ...role, lastModifiedAt: new Date()};
      // console.log(oldRole);
      if(role.name !== undefined) oldRole.name = role.name;
      if(role.authorities !== undefined) oldRole.authorities = role.authorities;
      if(role.status !== undefined) oldRole.status = role.status;
      if(role.deleted !== undefined) oldRole.deleted = role.deleted;
      oldRole.lastModifiedAt = new Date();
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
