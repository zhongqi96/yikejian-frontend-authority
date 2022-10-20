import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, TimePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;

@connect(state => ({
  customer: state.customer,
}))
@Form.create()
export default class CustomerForm extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, customer: { customer } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(customer.customerId){
          dispatch({
            type: 'customer/editCustomer',
            payload: {
              ...values,
              customerId: customer.customerId,
              account: {
                ...customer.account,
                ...values.account,
              },
            }
          });
        } else {
          dispatch({
            type: 'customer/postCustomer',
            payload: {
              ...values,
              account: {
                ...values.account,
                deleted: 0,
                effective: 1,
              },
              deleted: 0,
              effective: 1},
          });
        }
      }
    });
  }

  render() {
    const { customer: { formLoading: submitting, customer } } = this.props;
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
      <PageHeaderLayout title="创建会员" content="创建会员，请输入会员信息：">
        <Card>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="会员名称"
            >
              {getFieldDecorator('customerName', {
                initialValue: customer.customerName,
                rules: [{
                  required: true, message: '请输入会员名称',
                }],
              })(
                <Input placeholder="会员名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="会员电话"
            >
              {getFieldDecorator('mobileNumber', {
                initialValue: customer.mobileNumber,
                rules: [{
                  required: true, message: '请输入手机号码',
                }],
              })(
                <Input placeholder="输入会员手机号码" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="会员生日"
            >
              {getFieldDecorator('birthday', {
                initialValue: customer.birthday,
                rules: [{
                  required: true, message: '请输入会员生日',
                }],
              })(
                <Input placeholder="会员生日" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="账户余额"
            >
              {getFieldDecorator('account.balance', {
                initialValue: customer.account.balance || 0,
                rules: [{
                  required: true, message: '请输入账户余额',
                }],
              })(
                <Input placeholder="账户余额" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="总消费额"
            >
              {getFieldDecorator('account.amount', {
                initialValue: customer.account.amount || 0,
                rules: [{
                  required: true, message: '请输入总消费额',
                }],
              })(
                <Input placeholder="总消费额" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="积分"
            >
              {getFieldDecorator('account.point', {
                initialValue: customer.account.point || 0,
                rules: [{
                  required: true, message: '请输入总积分',
                }],
              })(
                <Input placeholder="总积分" />
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
