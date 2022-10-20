import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, TimePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;

@connect(state => ({
  template: state.template,
}))
@Form.create()
export default class TemplateForm extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, template: { template } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(template.templateId){
          dispatch({
            type: 'template/editTemplate',
            payload: {...values, templateId: template.templateId},
          });
        } else {
          dispatch({
            type: 'template/postTemplate',
            payload: {...values, deleted: 0, effective: 1},
          });
        }
      }
    });
  }

  render() {
    const { template: { formLoading: submitting, template } } = this.props;
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
      <PageHeaderLayout title="创建模板" content="创建模板，请输入模板信息：">
        <Card>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="模板名称"
            >
              {getFieldDecorator('templateName', {
                initialValue: template.templateName,
                rules: [{
                  required: true, message: '请输入模板名称',
                }],
              })(
                <Input placeholder="模板名称" />
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
