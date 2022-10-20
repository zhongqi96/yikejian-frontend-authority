import { routerRedux } from 'dva/router';
import { putInventories, getInventories } from '../services/inventory';
import { getStoreProducts } from '../services/store';

export default {
  namespace: 'inventory',

  state: {
    inventories: [],
    store: {},
    storeProducts: [],
    loading: false,
    formLoading: false,
  },

  effects: {
    *putInventories({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(putInventories, payload.inventories);
      if(response){
        // const response = yield call(getInventories, payload);
        yield put({
          type: 'saveInventories',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *getInventories({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getInventories, payload);
      yield put({
        type: 'saveInventories',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *init({ payload }, { call, put }){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'saveStore',
        payload: payload,
      });
      const response = yield call(getStoreProducts, payload);
      yield put({
        type: 'saveStoreProducts',
        payload: response,
      });
      yield put(routerRedux.push('/info/store/profile'));
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    }
  },

  reducers: {
    changeLoading(state, action){
      return {
        ...state,
        loading: action.payload,
      }
    },
    saveInventories(state, action) {
      return {
        ...state,
        inventories: action.payload,
      };
    },
    saveStore(state, action){
      return {
        ...state,
        store: action.payload,
      }
    },
    saveStoreProducts(state, action) {
      return {
        ...state,
        storeProducts: action.payload,
      }
    },
  },
};
