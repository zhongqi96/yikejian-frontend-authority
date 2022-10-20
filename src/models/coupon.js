import { routerRedux } from 'dva/router';
import { postCoupon, deleteCoupons, deleteCoupon, putCoupons, putCoupon, getCoupons, getCoupon } from '../services/coupon';

export default {
  namespace: 'coupon',

  state: {
    coupons: {
      list: [],
      pagination: {},
    },
    coupon: {
      key: '',
      name: '',
    },
    postCouponStatus: false,
    deleteCouponStatus: false,
    putCouponStatus: false,
    getCouponsStatus: false,
    getCouponStatus: false,
  },

  effects: {
    *postCoupon({ payload, callback }, { call, put }) {
      yield put({
        type: 'changePostCouponStatus',
        payload: true,
      });
      const response = yield call(postCoupon, payload);
      yield put({
        type: 'changePostCouponStatus',
        payload: false,
      });
      if (callback) callback(response);
    },
    *deleteCoupons({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeDeleteCouponStatus',
        payload: true,
      });
      const response = yield call(deleteCoupons, payload);
      yield put({
        type: 'changeDeleteCouponStatus',
        payload: false,
      });
      if (callback) callback(response);
    },
    *deleteCoupon({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeDeleteCouponStatus',
        payload: true,
      });
      const response = yield call(deleteCoupon, payload);
      yield put({
        type: 'changeDeleteCouponStatus',
        payload: false,
      });
      if (callback) callback(response);
    },
    *putCoupons({ payload, callback }, { call, put }) {
      yield put({
        type: 'changePutCouponStatus',
        payload: true,
      });
      const response = yield call(putCoupons, payload.coupons);
      yield put({
        type: 'changePutCouponStatus',
        payload: false,
      });
      if(response.status === 'ok'){
        yield put({
          type: 'changeGetCouponsStatus',
          payload: true,
        });
        const response = yield call(getCoupons, payload.params);
        yield put({
          type: 'saveCoupons',
          payload: response,
        });
        yield put({
          type: 'changeGetCouponsStatus',
          payload: false,
        });
      } else {
        if(callback) callback(response.msg);
      }
    },
    *putCoupon({ payload, callback }, { call, put }) {
      yield put({
        type: 'changePutCouponStatus',
        payload: true,
      });
      const response = yield call(putCoupon, payload.coupon);
      yield put({
        type: 'changePutCouponStatus',
        payload: false,
      });
      if(response.status === 'ok'){
        yield put({
          type: 'changeGetCouponsStatus',
          payload: true,
        });
        const response = yield call(getCoupons, payload.params);
        yield put({
          type: 'saveCoupons',
          payload: response,
        });
        yield put({
          type: 'changeGetCouponsStatus',
          payload: false,
        });
      } else {
        if(callback) callback(response.msg);
      }
    },
    *editCoupon({ payload, callback }, { call, put }) {
      yield put({
        type: 'changePutCouponStatus',
        payload: true,
      });
      const response = yield call(putCoupon, payload);
      yield put({
        type: 'changePutCouponStatus',
        payload: false,
      });
      if(response.status === 'ok'){
        yield put(routerRedux.push('/info/coupon/list'));
      } else {
        if(callback) callback(response.msg);
      }
    },
    *getCoupons({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeGetCouponsStatus',
        payload: true,
      });
      const response = yield call(getCoupons, payload);
      yield put({
        type: 'saveCoupons',
        payload: response,
      });
      yield put({
        type: 'changeGetCouponsStatus',
        payload: false,
      });
    },
    *getCoupon({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeGetCouponStatus',
        payload: true,
      });
      const response = yield call(getCoupon, payload);
      yield put({
        type: 'changeGetCouponStatus',
        payload: false,
      });
      if(response.status === 'ok') {
        yield put({
          type: 'saveCoupon',
          payload: response.coupon,
        });
        yield put(routerRedux.push('/info/coupon/form'));
      } else {
        if(callback) callback(response.msg);
      }
    },
  },

  reducers: {
    changePostCouponStatus(state, action) {
      return {
        ...state,
        postCouponStatus: action.payload,
      };
    },
    changeDeleteCouponStatus(state, action) {
      return {
        ...state,
        deleteCouponStatus: action.payload,
      };
    },
    changePutCouponStatus(state, action) {
      return {
        ...state,
        putCouponStatus: action.payload,
      };
    },
    changeGetCouponsStatus(state, action) {
      return {
        ...state,
        getCouponsStatus: action.payload,
      };
    },
    changeGetCouponStatus(state, action) {
      return {
        ...state,
        getCouponStatus: action.payload,
      };
    },
    saveCoupons(state, action) {
      return {
        ...state,
        coupons: action.payload,
      };
    },
    saveCoupon(state, action) {
      return {
        ...state,
        coupon: action.payload,
      };
    },
  },
};
