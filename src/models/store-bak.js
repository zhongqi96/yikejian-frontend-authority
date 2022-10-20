import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryStoreList, submitStore } from '../services/store';

export default {
  namespace: 'store',

  state: {
    list: [],
    loading: false,
    submitting: false,

    fetchStoreLoading: false,
    fetchProductLoading: false,
    fetchDeviceLoading: false,

    basicGoods: [],
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
    advancedLoading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryStoreList, payload);
      yield put({
        type: 'queryStore',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *submitForm({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(submitStore, payload);
      if(response.message === 'ok'){
        yield put({
          type: 'changeSubmitting',
          payload: false,
        });
        yield put(routerRedux.push('/info/store/list'));
        // message.success('提交成功');
      }
    },
    *fetchStore({ payload }, { call, put }) {
      yield put({
        type: 'fetchStoreLoading',
        payload: true,
      });
      const response = yield call(queryStoreList, payload);
      yield put({
        type: 'queryStore',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'fetchStoreLoading',
        payload: false,
      });
    },
    *fetchProduct({ payload }, { call, put }) {
      yield put({
        type: 'fetchProductLoading',
        payload: true,
      });
      const response = yield call(queryStoreList, payload);
      yield put({
        type: 'queryStore',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'fetchProductLoading',
        payload: false,
      });
    },
    *fetchDevice({ payload }, { call, put }) {
      yield put({
        type: 'fetchDeviceLoading',
        payload: true,
      });
      const response = yield call(queryStoreList, payload);
      yield put({
        type: 'queryStore',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'fetchDeviceLoading',
        payload: false,
      });
    },
  },

  reducers: {
    queryStore(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
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
