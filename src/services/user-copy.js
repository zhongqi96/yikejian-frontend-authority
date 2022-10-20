import { stringify } from 'qs';
import { request } from '../utils/request';
import { getToken as getLocalToken } from '../utils/token';

export async function queryCurrent() {
  // const params = {
  //   access_token: getLocalToken(),
  // };
  // return request(`/user-service/currentUser?${stringify(params)}`);
  return request(`/user-service/currentUser`);
}

export async function postUser(params) {
  return request('/user-service/user', {
    method: 'POST',
    body: params,
  });
}

export async function deleteUsers(params) {
  return request('/user-service/users', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteUser(params) {
  return request('/user-service/user', {
    method: 'DELETE',
    body: params,
  });
}

export async function putUsers(params){
  return request('/user-service/users', {
    method: 'PUT',
    body: params,
  });
}

export async function putUser(params){
  return request('/user-service/user', {
    method: 'PUT',
    body: params,
  });
}

export async function getUsers(params) {
  return request(`/user-service/users?${stringify(params)}`);
}

export async function getUser(params) {
  return request(`/user-service/user?${stringify(params)}`);
}

export async function getToken(params) {
  return request('/user-service/oauth/token', {
    method: 'POST',
    body: {
      ...params,
      grant_type: 'password',
    },
  });
}
