import { stringify } from 'qs';
import request from '../utils/request';

export async function postTemplate(params) {
  return request('/template-service/v1/template', {
    method: 'POST',
    body: params,
  });
}

export async function deleteTemplates(params) {
  return request('/template-service/v1/templates', {
    method: 'DELETE',
    body: params,
  });
}

export async function deleteTemplate(params) {
  return request('/template-service/v1/template', {
    method: 'DELETE',
    body: params,
  });
}

export async function putTemplates(params){
  return request('/template-service/v1/templates', {
    method: 'PUT',
    body: params,
  });
}

export async function putTemplate(params){
  return request('/template-service/v1/template', {
    method: 'PUT',
    body: params,
  });
}

export async function getTemplates(params) {
  return request(`/template-service/v1/templates?${stringify(params)}`);
}

export async function getTemplate(params) {
  return request(`/template-service/v1/template/${params.templateId}`);
}
