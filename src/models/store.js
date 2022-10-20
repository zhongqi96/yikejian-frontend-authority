import { routerRedux } from 'dva/router';
import { postStore, deleteStores, deleteStore, putStores, putStore, getStores, getStore } from '../services/store';
import { getProducts } from '../services/product';

export default {
  namespace: 'store',

  state: {
    list: [],
    store: {},
    loading: false,
    submitting: false,
    products: [],
    productOptions: [],
    checkedProducts: [],
    productsLoading: false,
  },

  effects: {
    *postStore({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(postStore, payload);
      if(response){
        yield put(routerRedux.push('/info/store/list'));
      }
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *deleteStores({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteStores, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *deleteStore({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteStore, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putStores({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putStores, payload.stores);
      if(response){
        const response = yield call(getStores, payload);
        yield put({
          type: 'saveStores',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putStore({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putStore, payload);
      if(response){
        const response = yield call(getStores, payload);
        yield put({
          type: 'saveStores',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *editStore({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(putStore, payload);
      if(response){
        const response = yield call(getStores, payload);
        yield put({
          type: 'saveStores',
          payload: response,
        });
        yield put(routerRedux.push('/info/store/list'));
      }
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *getStores({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(getStores, payload);
      yield put({
        type: 'saveStores',
        payload: response,
      });
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getStore({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      if(payload){
        const response = yield call(getStore, payload);
        // todo save products and check products
        if(response) {
          yield put({
            type: 'saveStore',
            payload: response,
          });
        }
      }
      yield put(routerRedux.push('/info/store/form'));
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *getProducts({ payload }, { call, put }){
      yield put({
        type: 'changeProductsLoading',
        payload: true,
      });
      const response = yield call(getProducts);
      yield put({
        type: 'saveProductOptions',
        payload: response,
      });
      yield put({
        type: 'changeProductsLoading',
        payload: false,
      });
    }
  },

  reducers: {
    changeListLoading(state, action){
      return {
        ...state,
        loading: action.payload,
      }
    },
    changeProductsLoading(state, action){
      return {
        ...state,
        productsLoading: action.payload,
      }
    },
    changeSubmitting(state, action){
      return {
        ...state,
        submitting: action.payload,
      }
    },
    saveStores(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveStore(state, action) {
      return {
        ...state,
        store: action.payload,
      };
    },
    saveProductOptions(state, action) {
      const productOptions = [];
      action.payload.map((product) => {
        productOptions.push({label: product.productName, value: product.productId});
      });
      return {
        ...state,
        productOptions,
        products: action.payload,
      };
    },
  },
};
