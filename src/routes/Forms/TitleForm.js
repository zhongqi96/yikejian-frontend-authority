import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, TimePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;

@connect(state => ({
  title: state.title,
}))
@Form.create()
export default class TitleForm extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, title: { title } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(title.titleId){
          dispatch({
            type: 'title/editTitle',
            payload: {...values, titleId: title.titleId},
          });
        } else {
          dispatch({
            type: 'title/postTitle',
            payload: {...values, deleted: 0, effective: 1},
          });
        }
      }
    });
  }

  render() {
    const { title: { formLoading: submitting, title } } = this.props;
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
      <PageHeaderLayout title="创建等级" content="创建等级，请输入等级信息：">
        <Card>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="等级名称"
            >
              {getFieldDecorator('titleName', {
                initialValue: title.titleName,
                rules: [{
                  required: true, message: '请输入等级名称',
                }],
              })(
                <Input placeholder="等级名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="等级条件"
            >
              {getFieldDecorator('threshold', {
                initialValue: title.threshold,
                rules: [{
                  required: true, message: '请输入等级条件',
                }],
              })(
                <Input placeholder="请输入等级对应的消费金额" />
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
