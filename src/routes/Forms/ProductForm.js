import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, TimePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import moment from 'moment';

const FormItem = Form.Item;
const timeFormat = 'HH:mm';
const { TextArea } = Input;

@connect(state => ({
  product: state.product,
}))
@Form.create()
export default class ProductForm extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, product: { product } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(product.productId){
          dispatch({
            type: 'product/editProduct',
            payload: {
              ...values,
              productId: product.productId,
              startTime: values['startTime'].format('HHmm'),
              endTime: values['endTime'].format('HHmm'),
            },
          });
        } else {
          dispatch({
            type: 'product/postProduct',
            payload: {
              ...values,
              deleted: 0,
              effective: 1,
              startTime: values['startTime'].format('HHmm'),
              endTime: values['endTime'].format('HHmm'),
            },
          });
        }
      }
    });
  }

  render() {
    const { product: { formLoading: submitting, product } } = this.props;
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
      <PageHeaderLayout title="创建产品" content="创建产品，请输入产品信息：">
        <Card>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="产品名称"
            >
              {getFieldDecorator('productName', {
                initialValue: product.productName,
                rules: [{
                  required: true, message: '请输入产品名称',
                }],
              })(
                <Input placeholder="产品名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="价格"
            >
              {getFieldDecorator('price', {
                initialValue: product.price,
                rules: [{
                  required: true, message: '请输入价格',
                }],
              })(
                <InputNumber placeholder="价格" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="服务时长"
            >
              {getFieldDecorator('duration', {
                initialValue: product.duration,
                rules: [{
                  required: true, message: '请输入服务时长',
                }],
              })(
                <InputNumber placeholder="服务时长" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="开始营业时间"
            >
              {getFieldDecorator('startTime', {
                initialValue: moment(product.startTime, 'HHmm'),
                rules: [{
                  required: true, message: '请选择开始营业时间',
                }],
              })(
                <TimePicker format={timeFormat} minuteStep={30} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="结束营业时间"
            >
              {getFieldDecorator('endTime', {
                initialValue: moment(product.endTime, 'HHmm'),
                rules: [{
                  required: true, message: '请选择结束营业时间',
                }],
              })(
                <TimePicker format={timeFormat} minuteStep={30} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="简介"
            >
              {getFieldDecorator('introduction', {
                initialValue: product.introduction,
                rules: [{
                  required: true, message: '请选择结束营业时间',
                }],
              })(
                <TextArea placeholder='请输入产品简介' autosize/>
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
