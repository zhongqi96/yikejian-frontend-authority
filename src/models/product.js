import { routerRedux } from 'dva/router';
import { postProduct, deleteProducts, deleteProduct, putProducts, putProduct, getProducts, getProduct } from '../services/product';

export default {
  namespace: 'product',

  state: {
    products: {
      list: [],
      pagination: {},
    },
    product: {
      id: '',
      name: '',
    },
    listLoading: false,
    formLoading: false,
  },

  effects: {
    *postProduct({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(postProduct, payload);
      if(response){
        yield put(routerRedux.push('/info/product/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *deleteProducts({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteProducts, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *deleteProduct({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteProduct, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putProducts({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putProducts, payload.products);
      if(response){
        const response = yield call(getProducts, payload);
        yield put({
          type: 'saveProducts',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putProduct({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putProduct, payload.product);
      if(response){
        const response = yield call(getProducts, payload);
        yield put({
          type: 'saveProducts',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *editProduct({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(putProduct, payload);
      if(response){
        const response = yield call(getProducts, payload);
        yield put({
          type: 'saveProducts',
          payload: response,
        });
        yield put(routerRedux.push('/info/product/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *getProducts({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(getProducts, payload);
      yield put({
        type: 'saveProducts',
        payload: response,
      });
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getProduct({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      if(!payload){
        yield put({
          type: 'saveProduct',
          payload: {
            id: '',
            name: '',
          },
        });
      } else {
        const response = yield call(getProduct, payload);
        if(response) {
          yield put({
            type: 'saveProduct',
            payload: response,
          });
        }
      }
      yield put(routerRedux.push('/info/product/form'));
      yield put({
        type: 'changeFormLoading',
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
    saveProducts(state, action) {
      return {
        ...state,
        products: action.payload,
      };
    },
    saveProduct(state, action) {
      return {
        ...state,
        product: action.payload,
      };
    },
  },
};
