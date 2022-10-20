import { stringify } from 'qs';
import request from '../utils/request';

export async function postOrder(params) {
  return request('/order-service/v1/order', {
    method: 'POST',
    body: params,
  });
}

export async function deleteOrders(params) {
  return request('/order-service/v1/orders', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteOrder(params) {
  return request('/order-service/v1/order', {
    method: 'DELETE',
    body: params,
  });
}

export async function putOrders(params){
  return request('/order-service/v1/orders', {
    method: 'PUT',
    body: params,
  });
}

export async function putOrder(params){
  return request('/order-service/v1/order', {
    method: 'PUT',
    body: params,
  });
}

export async function getOrders(params) {
  return request(`/order-service/v1/orders?${stringify(params)}`);
}

export async function getOrder(params) {
  return request(`/order-service/v1/order/${params.orderId}`);
}
