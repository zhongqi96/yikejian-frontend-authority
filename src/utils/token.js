export function getToken() {
  return localStorage.getItem('yikejian-manage-token');
}

export function setToken(token) {
  return localStorage.setItem('yikejian-manage-token', token);
}

export function cleanToken(){
  localStorage.removeItem('yikejian-manage-token');
}
