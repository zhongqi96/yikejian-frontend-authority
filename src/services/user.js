import { stringify } from 'qs';
import request from '../utils/request';

export async function queryCurrent() {
  return request(`/user-service/v1/me`);
}

export async function postUser(params) {
  return request('/user-service/v1/user', {
    method: 'POST',
    body: params,
  });
}

export async function deleteUsers(params) {
  return request('/user-service/v1/users', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteUser(params) {
  return request('/user-service/v1/user', {
    method: 'DELETE',
    body: params,
  });
}

export async function putUsers(params){
  return request('/user-service/v1/users', {
    method: 'PUT',
    body: params,
  });
}

export async function putUser(params){
  return request('/user-service/v1/user', {
    method: 'PUT',
    body: params,
  });
}

export async function getUsers(params) {
  return request(`/user-service/v1/users?${stringify(params)}`);
}

export async function getUser(params) {
  return request(`/user-service/v1/user/${params.key}`);
}

export async function getToken(params) {
  return request('/user-service/oauth/token', {
    method: 'POST',
    body: {
      grant_type: 'password',
      ...params,
    },
    auth: true,
  });
}
