import { getUrlParams } from './utils';
import moment from 'moment';

let userListDataSource = [];
for (let i = 0; i < 33; i += 1) {
  userListDataSource.push({
    key: i,
    name: i + ': Jim Green',
    age: Math.floor(Math.random() * 100),
    desc: 'she is a pretty girl.',
    role: Math.floor(Math.random() * 2) % 2 === 0 ? 'admin' : 'user',
    createdAt: new Date(`2017-12-${Math.floor(i / 2) + 1}`),
    status: Math.floor(Math.random() * 2) % 2,
  });
}

// 获取所有角色
export function getUsers(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...userListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  if (params.user) {
    dataSource = dataSource.filter(data => data.user.indexOf(params.user) > -1);
  }

  if (params.age) {
    dataSource = dataSource.filter(data => parseInt(data.age, 10) === parseInt(params.age, 10));
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

export function getUser(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...userListDataSource];

  dataSource = dataSource.filter(data => parseInt(data.key, 10) === parseInt(params.key, 10))

  console.log(`${dataSource[0].key} -- ${dataSource[0].name} -- ${dataSource[0].authorities}`);

  let result = {};
  if(dataSource.length > 0){
    result = {
      status: 'ok',
      user: dataSource[0],
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
export function postUser(req, res, u, b) {
  console.log(`add user.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name, authorities } = body;
  const i = Math.ceil(Math.random() * 10000);
  userListDataSource.unshift({
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
export function deleteUsers(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
export function deleteUser(req, res, u, b){
  res.json({
    status: 'ok'
  });
}
// 修改角色
export function putUsers(req, res, u, b){
  console.log(`update users.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const users = body;

  userListDataSource.forEach((oldUser) => {
    users.forEach((user) => {
      if(user.key === oldUser.key){
        // oldUser.status = user.status;
        // oldUser = {...oldUser, ...user};
        // const index = userListDataSource.indexOf(oldUser);
        // userListDataSource.splice(index, 1, {...oldUser, ...user});
        // userListDataSource.remove(oldUser);
        // userListDataSource.push({...oldUser, ...user});
        if(user.name !== undefined) oldUser.name = user.name;
        if(user.authorities !== undefined) oldUser.authorities = user.authorities;
        if(user.status !== undefined) oldUser.status = user.status;
        if(user.deleted !== undefined) oldUser.deleted = user.deleted;
        oldUser.lastModifiedAt = new Date();
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

export function putUser(req, res, u, b){
  console.log(`update user.`);

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const user = body;

  userListDataSource.forEach(oldUser => {
    if(user.key === oldUser.key){
      // console.log(user);
      // console.log(oldUser);
      // oldUser = {...oldUser, ...user, lastModifiedAt: new Date()};
      // console.log(oldUser);
      if(user.name !== undefined) oldUser.name = user.name;
      if(user.authorities !== undefined) oldUser.authorities = user.authorities;
      if(user.status !== undefined) oldUser.status = user.status;
      if(user.deleted !== undefined) oldUser.deleted = user.deleted;
      oldUser.lastModifiedAt = new Date();
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

export function getCurrentUser(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const access_token = params.access_token;
  let result = {};
  if(access_token === 'token-of-admin'){
    result = {
      ...result,
      name: 'admin',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
    }
  } else{
    result = {
      ...result,
      name: 'user',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '10000001',
    }
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getToken(req, res){
  console.log("mock getToken");
    const { password, userName, type } = req.body;
    if(password === '888888' && userName === 'admin'){
      res.send({
        status: 'ok',
        type,
        // currentRole: 'admin',
        token: 'token-of-admin',
      });
      return ;
    }
    if(password === '123456' && userName === 'user'){
      res.send({
        status: 'ok',
        type,
        // currentRole: 'user',
        token: 'token-of-user',
      });
      return ;
    }
    res.send({
      status: 'error',
      type,
      currentRole: 'guest',
    });
}
