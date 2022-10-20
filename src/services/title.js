import { stringify } from 'qs';
import request from '../utils/request';

export async function postTitle(params) {
  return request('/customer-service/v1/title', {
    method: 'POST',
    body: params,
  });
}

export async function deleteTitles(params) {
  return request('/customer-service/v1/titles', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteTitle(params) {
  return request('/customer-service/v1/title', {
    method: 'DELETE',
    body: params,
  });
}

export async function putTitles(params){
  return request('/customer-service/v1/titles', {
    method: 'PUT',
    body: params,
  });
}

export async function putTitle(params){
  return request('/customer-service/v1/title', {
    method: 'PUT',
    body: params,
  });
}

export async function getTitles(params) {
  return request(`/customer-service/v1/titles?${stringify(params)}`);
}

export async function getTitle(params) {
  return request(`/customer-service/v1/title/${params.titleId}`);
}
