import { stringify } from 'qs';
import request from '../utils/request';

export async function postCoupon(params) {
  return request('/coupon-service/coupon', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCoupons(params) {
  return request('/coupon-service/coupons', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteCoupon(params) {
  return request('/coupon-service/coupon', {
    method: 'DELETE',
    body: params,
  });
}

export async function putCoupons(params){
  return request('/coupon-service/coupons', {
    method: 'PUT',
    body: params,
  });
}

export async function putCoupon(params){
  return request('/coupon-service/coupon', {
    method: 'PUT',
    body: params,
  });
}

export async function getCoupons(params) {
  return request(`/coupon-service/coupons?${stringify(params)}`);
}

export async function getCoupon(params) {
  return request(`/coupon-service/coupon?${stringify(params)}`);
}
