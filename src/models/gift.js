import { routerRedux } from 'dva/router';
import { postGift, deleteGifts, deleteGift, putGifts, putGift, getGifts, getGift } from '../services/gift';

export default {
  namespace: 'gift',

  state: {
    gifts: {
      list: [],
      pagination: {},
    },
    gift: {
      key: '',
      name: '',
    },
    postGiftStatus: false,
    deleteGiftStatus: false,
    putGiftStatus: false,
    getGiftsStatus: false,
    getGiftStatus: false,
  },

  effects: {
    *postGift({ payload, callback }, { call, put }) {
      yield put({
        type: 'changePostGiftStatus',
        payload: true,
      });
      const response = yield call(postGift, payload);
      yield put({
        type: 'changePostGiftStatus',
        payload: false,
      });
      if (callback) callback(response);
    },
    *deleteGifts({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeDeleteGiftStatus',
        payload: true,
      });
      const response = yield call(deleteGifts, payload);
      yield put({
        type: 'changeDeleteGiftStatus',
        payload: false,
      });
      if (callback) callback(response);
    },
    *deleteGift({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeDeleteGiftStatus',
        payload: true,
      });
      const response = yield call(deleteGift, payload);
      yield put({
        type: 'changeDeleteGiftStatus',
        payload: false,
      });
      if (callback) callback(response);
    },
    *putGifts({ payload, callback }, { call, put }) {
      yield put({
        type: 'changePutGiftStatus',
        payload: true,
      });
      const response = yield call(putGifts, payload.gifts);
      yield put({
        type: 'changePutGiftStatus',
        payload: false,
      });
      if(response.status === 'ok'){
        yield put({
          type: 'changeGetGiftsStatus',
          payload: true,
        });
        const response = yield call(getGifts, payload.params);
        yield put({
          type: 'saveGifts',
          payload: response,
        });
        yield put({
          type: 'changeGetGiftsStatus',
          payload: false,
        });
      } else {
        if(callback) callback(response.msg);
      }
    },
    *putGift({ payload, callback }, { call, put }) {
      yield put({
        type: 'changePutGiftStatus',
        payload: true,
      });
      const response = yield call(putGift, payload.gift);
      yield put({
        type: 'changePutGiftStatus',
        payload: false,
      });
      if(response.status === 'ok'){
        yield put({
          type: 'changeGetGiftsStatus',
          payload: true,
        });
        const response = yield call(getGifts, payload.params);
        yield put({
          type: 'saveGifts',
          payload: response,
        });
        yield put({
          type: 'changeGetGiftsStatus',
          payload: false,
        });
      } else {
        if(callback) callback(response.msg);
      }
    },
    *editGift({ payload, callback }, { call, put }) {
      yield put({
        type: 'changePutGiftStatus',
        payload: true,
      });
      const response = yield call(putGift, payload);
      yield put({
        type: 'changePutGiftStatus',
        payload: false,
      });
      if(response.status === 'ok'){
        yield put(routerRedux.push('/info/gift/list'));
      } else {
        if(callback) callback(response.msg);
      }
    },
    *getGifts({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeGetGiftsStatus',
        payload: true,
      });
      const response = yield call(getGifts, payload);
      yield put({
        type: 'saveGifts',
        payload: response,
      });
      yield put({
        type: 'changeGetGiftsStatus',
        payload: false,
      });
    },
    *getGift({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeGetGiftStatus',
        payload: true,
      });
      const response = yield call(getGift, payload);
      yield put({
        type: 'changeGetGiftStatus',
        payload: false,
      });
      if(response.status === 'ok') {
        yield put({
          type: 'saveGift',
          payload: response.gift,
        });
        yield put(routerRedux.push('/info/gift/form'));
      } else {
        if(callback) callback(response.msg);
      }
    },
  },

  reducers: {
    changePostGiftStatus(state, action) {
      return {
        ...state,
        postGiftStatus: action.payload,
      };
    },
    changeDeleteGiftStatus(state, action) {
      return {
        ...state,
        deleteGiftStatus: action.payload,
      };
    },
    changePutGiftStatus(state, action) {
      return {
        ...state,
        putGiftStatus: action.payload,
      };
    },
    changeGetGiftsStatus(state, action) {
      return {
        ...state,
        getGiftsStatus: action.payload,
      };
    },
    changeGetGiftStatus(state, action) {
      return {
        ...state,
        getGiftStatus: action.payload,
      };
    },
    saveGifts(state, action) {
      return {
        ...state,
        gifts: action.payload,
      };
    },
    saveGift(state, action) {
      return {
        ...state,
        gift: action.payload,
      };
    },
  },
};
