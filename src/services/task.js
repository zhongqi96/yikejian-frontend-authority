import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTasks(params) {
  return request(`/order-service/v1/items?${stringify(params)}`);
}
