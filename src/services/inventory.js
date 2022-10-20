import { stringify } from 'qs';
import request from '../utils/request';

export async function putInventories(params){
  console.log('putInventories get params: ', params);
  return request('/inventory-service/v1/inventories', {
    method: 'PUT',
    body: params,
  });
}

export async function getInventories(params) {
  return request(`/inventory-service/v1/inventories/${params.storeId}/${params.productId}?day=${params.day}`);
}
