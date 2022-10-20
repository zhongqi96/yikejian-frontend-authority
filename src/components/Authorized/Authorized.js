import React from 'react';
import { setRole } from '../../utils/role';

class Authorized extends React.Component {
  render() {
    const { children, authorizedRole, getRole, noMatch = null } = this.props;
    const childrenRender = typeof children === 'undefined' ? null : children;
    let currentRoles;
    if (getRole) {
      currentRoles = getRole();
    }
    if (!authorizedRole || !authorizedRole.length) {
      return childrenRender;
    }
    // return authorizedRole.indexOf(currentRoles) > -1 ? childrenRender : noMatch;

    for (var role of currentRoles.split(',')){
      if (authorizedRole.indexOf(role) > -1)
        return childrenRender;
    }
    setRole('guest');
    return noMatch;
  }
}

// for MenuItem, SubMenu and etc. which can not be wrapped by customized component.
// https://github.com/ant-design/ant-design/issues/4853
const authorizedCreate = ({ authorizedRole, getRole, noMatch = null }) => {
  return (Comp) => {
    let currentRoles;
    if (getRole) {
      currentRoles = getRole();
    }
    if (!authorizedRole || !authorizedRole.length) {
      return Comp;
    }
    // return authorizedRole.indexOf(currentRole) > -1 ? Comp : noMatch;

    for (var role of currentRoles.split(',')){
      if (authorizedRole.indexOf(role) > -1)
        return Comp;
    }
    return noMatch;
  };
};

Authorized.create = authorizedCreate;
export default Authorized;
