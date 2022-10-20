import { stringify } from 'qs';
import request from '../utils/request';

export async function queryUserLogs(params) {
  return request(`/api/userlogs?${stringify(params)}`);
}
