import { stringify } from 'qs';
import request from '../utils/request';

export async function postRole(params) {
  return request('/user-service/v1/role', {
    method: 'POST',
    body: params,
  });
}

export async function deleteRoles(params) {
  return request('/user-service/v1/roles', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteRole(params) {
  return request('/user-service/v1/role', {
    method: 'DELETE',
    body: params,
  });
}

export async function putRoles(params){
  return request('/user-service/v1/roles', {
    method: 'PUT',
    body: params,
  });
}

export async function putRole(params){
  return request('/user-service/v1/role', {
    method: 'PUT',
    body: params,
  });
}

export async function getRoles(params) {
  const paramsString = stringify(params);
  return request(`/user-service/v1/roles?${paramsString}`);
}

export async function getRole(params) {
  // return request(`/user-service/v1/role?${stringify(params)}`);
  return request(`/user-service/v1/role/${params.key}`);
}

export async function getAuthorities(params){
  return request(`/user-service/v1/authorities?${stringify(params)}`);
}
