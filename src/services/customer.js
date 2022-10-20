import { stringify } from 'qs';
import request from '../utils/request';

export async function postCustomer(params) {
  return request('/customer-service/v1/customer', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCustomers(params) {
  return request('/customer-service/v1/customers', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteCustomer(params) {
  return request('/customer-service/v1/customer', {
    method: 'DELETE',
    body: params,
  });
}

export async function putCustomers(params){
  return request('/customer-service/v1/customers', {
    method: 'PUT',
    body: params,
  });
}

export async function putCustomer(params){
  return request('/customer-service/v1/customer', {
    method: 'PUT',
    body: params,
  });
}

export async function getCustomers(params) {
  return request(`/customer-service/v1/customers?${stringify(params)}`);
}

export async function getCustomer(params) {
  return request(`/customer-service/v1/customer/${params.customerId}`);
}
