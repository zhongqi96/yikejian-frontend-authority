import { queryTasks } from '../services/task';

export default {
  namespace: 'task',

  state: {
    tasks: {
      list: [],
      pagination: {},
    },
    loading: false,
    runningTasks: {
      list: [],
      pagination: {},
    },
    runningLoading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryTasks, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchRunning({ payload }, { call, put }) {
      yield put({
        type: 'changeRunningLoading',
        payload: true,
      });
      const response = yield call(queryTasks, payload);
      yield put({
        type: 'saveRunning',
        payload: response,
      });
      yield put({
        type: 'changeRunningLoading',
        payload: false,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        tasks: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveRunning(state, action) {
      return {
        ...state,
        runningTasks: action.payload,
      };
    },
    changeRunningLoading(state, action) {
      return {
        ...state,
        runningLoading: action.payload,
      };
    },
  },
};
