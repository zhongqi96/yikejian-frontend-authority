import { routerRedux } from 'dva/router';
import { postRole, deleteRoles, deleteRole, putRoles, putRole, getRoles, getRole, getAuthorities } from '../services/role';

export default {
  namespace: 'role',

  state: {
    roles: {
      list: [],
      pagination: {},
    },
    role: {
      // roleId: '',
      // roleName: '',
      // authorities: '',
    },
    authorities: [],
    // postRoleStatus: false,
    // deleteRoleStatus: false,
    // putRoleStatus: false,
    // getRolesStatus: false,
    listLoading: false,
    // getRoleStatus: false,
    // getAuthoritiesStatus: false,
    authorityLoading: false,
  },

  effects: {
    *postRole({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(postRole, payload);
      if(response){
        yield put(routerRedux.push('/sys/role/list'));
      } else {
        if (callback) callback(response.msg);
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *deleteRoles({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteRoles, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
      if (callback) callback(response.msg);
    },
    *deleteRole({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteRole, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
      if (callback) callback(response.msg);
    },
    *putRoles({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const roles = yield call(putRoles, payload.roles);
      if(roles) {
        const response = yield call(getRoles, payload);
        yield put({
          type: 'saveRoles',
          payload: response,
        });
      } else {
        if(callback) callback(response.msg);
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putRole({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const role = yield call(putRole, payload.role);
      if (role) {
        const response = yield call(getRoles, payload);
        yield put({
          type: 'saveRoles',
          payload: response,
        });
      } else {
        if(callback) callback(response.msg);
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *editRole({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putRole, payload);
      if(response){
        const response = yield call(getRoles, payload);
        yield put({
          type: 'saveRoles',
          payload: response,
        });
        yield put(routerRedux.push('/sys/role/list'));
        // location.reload();
      } else {
        if(callback) callback(response.msg);
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getRoles({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(getRoles, payload);
      yield put({
        type: 'saveRoles',
        payload: response,
      });
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getRole({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      if(!payload){
        yield put({
          type: 'saveRole',
          payload: {},
        });
        yield put(routerRedux.push('/sys/role/form'));
      }
      const response = yield call(getRole, payload);
      if(response) {
        yield put({
          type: 'saveRole',
          payload: response,
        });
        yield put(routerRedux.push('/sys/role/form'));
      } else {
        if(callback) callback(response.msg);
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getAuthorities({ payload }, { call, put }) {
      yield put({
        type: 'changeAuthorityLoading',
        payload: true,
      });
      const response = yield call(getAuthorities, payload);
      yield put({
        type: 'saveAuthorities',
        payload: response,
      });
      yield put({
        type: 'changeAuthorityLoading',
        payload: false,
      });
    },
  },

  reducers: {
    // changePostRoleStatus(state, action) {
    //   return {
    //     ...state,
    //     postRoleStatus: action.payload,
    //   };
    // },
    // changeDeleteRoleStatus(state, action) {
    //   return {
    //     ...state,
    //     deleteRoleStatus: action.payload,
    //   };
    // },
    // changePutRoleStatus(state, action) {
    //   return {
    //     ...state,
    //     putRoleStatus: action.payload,
    //   };
    // },
    changeListLoading(state, action) {
      return {
        ...state,
        listLoading: action.payload,
      };
    },
    // changeGetRoleStatus(state, action) {
    //   return {
    //     ...state,
    //     getRoleStatus: action.payload,
    //   };
    // },
    saveRoles(state, action) {
      return {
        ...state,
        roles: action.payload,
      };
    },
    saveRole(state, action) {
      return {
        ...state,
        role: action.payload,
      };
    },
    saveAuthorities(state, action) {
      return {
        ...state,
        authorities: action.payload,
      };
    },
    changeAuthorityLoading(state, action) {
      return {
        ...state,
        authorityLoading: action.payload,
      };
    },
  },
};
