import { stringify } from 'qs';
import request from '../utils/request';

export async function postProduct(params) {
  return request('/product-service/v1/product', {
    method: 'POST',
    body: params,
  });
}

export async function deleteProducts(params) {
  return request('/product-service/v1/products', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteProduct(params) {
  return request('/product-service/v1/product', {
    method: 'DELETE',
    body: params,
  });
}

export async function putProducts(params){
  return request('/product-service/v1/products', {
    method: 'PUT',
    body: params,
  });
}

export async function putProduct(params){
  return request('/product-service/v1/product', {
    method: 'PUT',
    body: params,
  });
}

export async function getProducts(params) {
  return request(`/product-service/v1/products?${stringify(params)}`);
}

export async function getProduct(params) {
  return request(`/product-service/v1/product/${params.productId}`);
}
