import { routerRedux } from 'dva/router';
import { postCustomer, deleteCustomers, deleteCustomer, putCustomers, putCustomer, getCustomers, getCustomer } from '../services/customer';

export default {
  namespace: 'customer',

  state: {
    customers: {
      list: [],
      pagination: {},
    },
    customer: {
      customerId: '',
      customerName: '',
      mobileNumber: '',
      birthday: '',
      account: {
        accountId: '',
        balance: '',
        amount: '',
        effective: 1,
        deleted: 0,
      },
    },
    listLoading: false,
    formLoading: false,
  },

  effects: {
    *postCustomer({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(postCustomer, payload);
      if(response){
        yield put(routerRedux.push('/customer/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *deleteCustomers({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteCustomers, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *deleteCustomer({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteCustomer, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putCustomers({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putCustomers, payload.customers);
      if(response){
        const response = yield call(getCustomers, payload);
        yield put({
          type: 'saveCustomers',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putCustomer({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putCustomer, payload.customer);
      if(response){
        const response = yield call(getCustomers, payload);
        yield put({
          type: 'saveCustomers',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *editCustomer({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(putCustomer, payload);
      if(response){
        const response = yield call(getCustomers, payload);
        yield put({
          type: 'saveCustomers',
          payload: response,
        });
        yield put(routerRedux.push('/customer/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *getCustomers({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(getCustomers, payload);
      yield put({
        type: 'saveCustomers',
        payload: response,
      });
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getCustomer({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      if(!payload){
        yield put({
          type: 'saveCustomer',
          payload: {
            customerId: '',
            customerName: '',
            mobileNumber: '',
            birthday: '',
            account: {
              accountId: '',
              balance: '',
              amount: '',
              effective: 1,
              deleted: 0,
            },
          },
        });
      } else {
        const response = yield call(getCustomer, payload);
        if(response) {
          yield put({
            type: 'saveCustomer',
            payload: response,
          });
        }
      }
      yield put(routerRedux.push('/customer/form'));
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
    saveCustomers(state, action) {
      return {
        ...state,
        customers: action.payload,
      };
    },
    saveCustomer(state, action) {
      return {
        ...state,
        customer: action.payload,
      };
    },
  },
};
