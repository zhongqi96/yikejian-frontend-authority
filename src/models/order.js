import { routerRedux } from 'dva/router';
import { postOrder, deleteOrders, deleteOrder, putOrders, putOrder, getOrders, getOrder } from '../services/order';
import { getStores, getStoreProducts } from '../services/store';

export default {
  namespace: 'order',

  state: {
    orders: {
      list: [],
      pagination: {},
    },
    order: {
      mobileNumber: '',
      storeId: '',
      orderItems: [],
    },
    stores: [],
    storeProducts: [],
    listLoading: false,
    formLoading: false,
    itemLoading: false,
  },

  effects: {
    *postOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(postOrder, payload);
      if(response){
        yield put(routerRedux.push('/order/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *deleteOrders({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteOrders, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *deleteOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteOrder, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putOrders({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putOrders, payload.orders);
      if(response){
        const response = yield call(getOrders, payload);
        yield put({
          type: 'saveOrders',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putOrder, payload.order);
      if(response){
        const response = yield call(getOrders, payload);
        yield put({
          type: 'saveOrders',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *editOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(putOrder, payload);
      if(response){
        const response = yield call(getOrders, payload);
        yield put({
          type: 'saveOrders',
          payload: response,
        });
        yield put(routerRedux.push('/order/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *getOrders({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(getOrders, payload);
      yield put({
        type: 'saveOrders',
        payload: response,
      });
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      if(!payload){
        yield put({
          type: 'saveOrder',
          payload: {
            mobileNumber: '',
            storeId: '',
            orderItems: [],
          },
        });
      } else {
        const response = yield call(getOrder, payload);
        if(response) {
          yield put({
            type: 'saveOrder',
            payload: response,
          });
        }
      }
      yield put(routerRedux.push('/order/form'));
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *getStores({ payload }, { call, put }){
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(getStores);
      yield put({
        type: 'saveStores',
        payload: response,
      });
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *getStoreProducts({ payload }, { call, put }){
      yield put({
        type: 'changeItemLoading',
        payload: true,
      });
      const response = yield call(getStoreProducts, payload);
      yield put({
        type: 'saveStoreProducts',
        payload: response,
      });
      yield put({
        type: 'changeItemLoading',
        payload: false,
      });
    }
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
    changeItemLoading(state, action){
      return {
        ...state,
        itemLoading: action.payload,
      }
    },
    saveOrders(state, action) {
      return {
        ...state,
        orders: action.payload,
      };
    },
    saveOrder(state, action) {
      return {
        ...state,
        order: action.payload,
      };
    },
    saveStores(state, action) {
      return {
        ...state,
        stores: action.payload,
      }
    },
    saveStoreProducts(state, action) {
      return {
        ...state,
        storeProducts: action.payload,
      }
    }
  },
};
