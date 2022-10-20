import { routerRedux } from 'dva/router';
import { postUser, deleteUsers, deleteUser, putUsers, putUser, getUsers, getUser, queryCurrent } from '../services/user';

export default {
  namespace: 'user',

  state: {
    users: {
      list: [],
      pagination: {},
    },
    user: {
      id: '',
      name: '',
      role: {
        roleId: '',
        roleName: '',
      }
    },
    currentUser: {},
    listLoading: false,
    currentLoading: false,
    formLoading: false,
  },

  effects: {
    *postUser({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(postUser, payload);
      if(response){
        yield put(routerRedux.push('/sys/user/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *deleteUsers({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteUsers, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *deleteUser({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteUser, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putUsers({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putUsers, payload.users);
      if(response){
        const response = yield call(getUsers, payload);
        yield put({
          type: 'saveUsers',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putUser({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putUser, payload.user);
      if(response){
        const response = yield call(getUsers, payload);
        yield put({
          type: 'saveUsers',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *editUser({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(putUser, payload);
      if(response){
        const response = yield call(getUsers, payload);
        yield put({
          type: 'saveUsers',
          payload: response,
        });
        yield put(routerRedux.push('/sys/user/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *getUsers({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(getUsers, payload);
      yield put({
        type: 'saveUsers',
        payload: response,
      });
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getUser({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      if(!payload){
        yield put({
          type: 'saveUser',
          payload: {
            id: '',
            name: '',
            role: {
              roleId: '',
              roleName: '',
            }
          },
        });
      } else {
        const response = yield call(getUser, payload);
        if(response) {
          yield put({
            type: 'saveUser',
            payload: response,
          });
        }
      }
      yield put(routerRedux.push('/sys/user/form'));
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'changeCurrentLoading',
        payload: true,
      });
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      yield put({
        type: 'changeCurrentLoading',
        payload: false,
      });
    },
  },

  reducers: {
    changeListLoading(state, action){
      return {
        ...state,
        listLoading: action.payload,
      }
    },
    changeFormLoading(state, action){
      return {
        ...state,
        formLoading: action.payload,
      }
    },
    changeCurrentLoading(state, action){
      return {
        ...state,
        currentLoading: action.payload,
      }
    },
    saveUsers(state, action) {
      return {
        ...state,
        users: action.payload,
      };
    },
    saveUser(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
