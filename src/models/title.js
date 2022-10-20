import { routerRedux } from 'dva/router';
import { postTitle, deleteTitles, deleteTitle, putTitles, putTitle, getTitles, getTitle, queryCurrent } from '../services/title';

export default {
  namespace: 'title',

  state: {
    titles: {
      list: [],
      pagination: {},
    },
    title: {
      id: '',
      name: '',
    },
    listLoading: false,
    formLoading: false,
  },

  effects: {
    *postTitle({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(postTitle, payload);
      if(response){
        yield put(routerRedux.push('/customer/title/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *deleteTitles({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteTitles, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *deleteTitle({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteTitle, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putTitles({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putTitles, payload.titles);
      if(response){
        const response = yield call(getTitles, payload);
        yield put({
          type: 'saveTitles',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putTitle({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putTitle, payload.title);
      if(response){
        const response = yield call(getTitles, payload);
        yield put({
          type: 'saveTitles',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *editTitle({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(putTitle, payload);
      if(response){
        const response = yield call(getTitles, payload);
        yield put({
          type: 'saveTitles',
          payload: response,
        });
        yield put(routerRedux.push('/customer/title/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *getTitles({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(getTitles, payload);
      yield put({
        type: 'saveTitles',
        payload: response,
      });
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getTitle({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      if(!payload){
        yield put({
          type: 'saveTitle',
          payload: {
            id: '',
            name: '',
          },
        });
      } else {
        const response = yield call(getTitle, payload);
        if(response) {
          yield put({
            type: 'saveTitle',
            payload: response,
          });
        }
      }
      yield put(routerRedux.push('/customer/title/form'));
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
    saveTitles(state, action) {
      return {
        ...state,
        titles: action.payload,
      };
    },
    saveTitle(state, action) {
      return {
        ...state,
        title: action.payload,
      };
    },
  },
};
