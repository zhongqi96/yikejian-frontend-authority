// use localStorage to store the role info, which might be sent from server in actual project.
export function getRole() {
  return localStorage.getItem('yikejian-manage-role') || 'guest';
}

export function setRole(role) {
  return localStorage.setItem('yikejian-manage-role', role);
}

export function cleanRole(){
  localStorage.removeItem('yikejian-manage-role');
}
