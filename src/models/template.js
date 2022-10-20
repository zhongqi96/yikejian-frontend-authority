import { routerRedux } from 'dva/router';
import { postTemplate, deleteTemplates, deleteTemplate, putTemplates, putTemplate, getTemplates, getTemplate } from '../services/template';

export default {
  namespace: 'template',

  state: {
    templates: {
      list: [],
      pagination: {},
    },
    template: {
      id: '',
      name: '',
    },
    listLoading: false,
    formLoading: false,
  },

  effects: {
    *postTemplate({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(postTemplate, payload);
      if(response){
        yield put(routerRedux.push('/template/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *deleteTemplates({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteTemplates, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *deleteTemplate({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(deleteTemplate, payload);
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putTemplates({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putTemplates, payload.templates);
      if(response){
        const response = yield call(getTemplates, payload);
        yield put({
          type: 'saveTemplates',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *putTemplate({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(putTemplate, payload.template);
      if(response){
        const response = yield call(getTemplates, payload);
        yield put({
          type: 'saveTemplates',
          payload: response,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *editTemplate({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      const response = yield call(putTemplate, payload);
      if(response){
        const response = yield call(getTemplates, payload);
        yield put({
          type: 'saveTemplates',
          payload: response,
        });
        yield put(routerRedux.push('/template/list'));
      }
      yield put({
        type: 'changeFormLoading',
        payload: false,
      });
    },
    *getTemplates({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(getTemplates, payload);
      yield put({
        type: 'saveTemplates',
        payload: response,
      });
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *getTemplate({ payload }, { call, put }) {
      yield put({
        type: 'changeFormLoading',
        payload: true,
      });
      if(!payload){
        yield put({
          type: 'saveTemplate',
          payload: {
            id: '',
            name: '',
          },
        });
      } else {
        const response = yield call(getTemplate, payload);
        if(response) {
          yield put({
            type: 'saveTemplate',
            payload: response,
          });
        }
      }
      yield put(routerRedux.push('/template/form'));
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
    saveTemplates(state, action) {
      return {
        ...state,
        templates: action.payload,
      };
    },
    saveTemplate(state, action) {
      return {
        ...state,
        template: action.payload,
      };
    },
  },
};
