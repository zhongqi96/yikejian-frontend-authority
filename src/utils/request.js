import { stringify } from 'qs';
import fetch from 'dva/fetch';
import { notification } from 'antd';
import { cleanToken, getToken as getLocalToken } from '../utils/token';
import { cleanRole } from '../utils/role';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  // 400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  400: '发出的请求有错误，请检查输入参数。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if(response.status === 400 || response.status === 401 || response.status === 402){
    cleanToken();
    cleanRole();
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + getLocalToken(),
    },
  };
  const newOptions = { ...defaultOptions, ...options };
  let newUrl = url;
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if(newOptions.auth){
      newOptions.headers = {
        ...newOptions.headers,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        // 'Authorization': 'Basic dHJ1c3RlZDpzZWNyZXQ=',
        'Authorization': 'Basic ' + window.btoa('trusted:secret'),
      };
      newOptions.body = 'a%3da%26grant_type%3dpassword%26username%3d' + newOptions.body.userName + '%26password%3d' + newOptions.body.password + '%26a%3da';
      // newOptions.body = 'grant_type=' + encodeURIComponent('password');
    } else {
      newOptions.headers = {
        ...newOptions.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        // 'Authorization': 'Bearer ' + getLocalToken(),
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }
  }
  // else {
  //   if(newUrl.indexOf('?') > -1) {
  //     newUrl = newUrl + "&access_token=" + getLocalToken();
  //   } else {
  //     newUrl = newUrl + "?access_token=" + getLocalToken();
  //   }
  // }

  return fetch(newUrl, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    });
}
