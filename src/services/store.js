import { stringify } from 'qs';
import request from '../utils/request';

// export async function queryStoreList(params) {
//   return request(`/api/stores?${stringify(params)}`);
// }
//
// export async function submitStore(params) {
//   return request('/api/store', {
//     method: 'POST',
//     body: params,
//   });
// }

export async function postStore(params) {
  return request('/store-service/v1/store', {
    method: 'POST',
    body: params,
  });
}

export async function deleteStores(params) {
  return request('/store-service/v1/stores', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteStore(params) {
  return request('/store-service/v1/store', {
    method: 'DELETE',
    body: params,
  });
}

export async function putStores(params){
  return request('/store-service/v1/stores', {
    method: 'PUT',
    body: params,
  });
}

export async function putStore(params){
  return request('/store-service/v1/store', {
    method: 'PUT',
    body: params,
  });
}

export async function getStores(params) {
  return request(`/store-service/v1/stores?${stringify(params)}`);
}

export async function getStore(params) {
  return request(`/store-service/v1/store/${params.storeId}`);
}

export async function getStoreProducts(params){
  return request(`/store-service/v1/store/${params.storeId}/products`);
}
