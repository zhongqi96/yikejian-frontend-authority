import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, TimePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;

@connect(state => ({
  coupon: state.coupon,
}))
@Form.create()
export default class CouponForm extends PureComponent {

  listCoupon = (res) => {
    const { dispatch } = this.props;
    if(res.status === 'ok'){
      dispatch(routerRedux.push(`/info/coupon/list`));
    } else {
      message.error(res.msg);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, coupon: { coupon } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(coupon.key){
          dispatch({
            type: 'coupon/editCoupon',
            payload: {...values, key: coupon.key},
            callback: this.listCoupon,
          });
        } else {
          dispatch({
            type: 'coupon/postCoupon',
            payload: values,
            callback: this.listCoupon,
          });
        }
      }
    });
  }

  render() {
    const { coupon: { postCouponStatus: submitting, coupon } } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title="创建优惠券" content="创建优惠券，并分配其拥有的权限">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="优惠券名称"
            >
              {getFieldDecorator('name', {
                initialValue: coupon.name,
                rules: [{
                  required: true, message: '请输入优惠券名称',
                }],
              })(
                <Input placeholder="给优惠券起个名字" />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
