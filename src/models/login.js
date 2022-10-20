import { routerRedux } from 'dva/router';
import { getToken, queryCurrent } from '../services/user';
import { setRole } from '../utils/role';
import { setToken, getToken as getLocalToken } from '../utils/token';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      // const response = yield call(fakeAccountLogin, payload);
      const localToken = yield call(getLocalToken);
      if(localToken == undefined) {
        const response = yield call(getToken, payload);
        const access_token = response.access_token;
        setToken(access_token);
        // const responseUser = yield call(queryCurrent, { access_token: access_token });
        const responseUser = yield call(queryCurrent);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            authorities: responseUser.role.authorities,
          },
        });
        yield put(routerRedux.push('/'));
        // 非常粗暴的跳转
        location.reload();
      } else {
        // const user = yield call(queryCurrent, { access_token: localToken });
        const user = yield call(queryCurrent);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            token: localToken,
            authorities: user.role.authorities,
          },
        });
        yield put(routerRedux.push('/'));
        // 非常粗暴的跳转
        location.reload();
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentRole: 'guest',
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setRole(payload.authorities);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
