import { stringify } from 'qs';
import request from '../utils/request';

export async function postGift(params) {
  return request('/gift-service/gift', {
    method: 'POST',
    body: params,
  });
}

export async function deleteGifts(params) {
  return request('/gift-service/gifts', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteGift(params) {
  return request('/gift-service/gift', {
    method: 'DELETE',
    body: params,
  });
}

export async function putGifts(params){
  return request('/gift-service/gifts', {
    method: 'PUT',
    body: params,
  });
}

export async function putGift(params){
  return request('/gift-service/gift', {
    method: 'PUT',
    body: params,
  });
}

export async function getGifts(params) {
  return request(`/gift-service/gifts?${stringify(params)}`);
}

export async function getGift(params) {
  return request(`/gift-service/gift?${stringify(params)}`);
}
