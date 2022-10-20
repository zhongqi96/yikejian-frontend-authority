import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, TimePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;

@connect(state => ({
  user: state.user,
  role: state.role,
}))
@Form.create()
export default class UserForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getRoles',
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, user: { user } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(user.id){
          dispatch({
            type: 'user/editUser',
            payload: {...values, id: user.id},
          });
        } else {
          dispatch({
            type: 'user/postUser',
            payload: {...values, deleted: 0, effective: 1},
          });
        }
      }
    });
  }

  render() {
    const { user: { formLoading: submitting, user } } = this.props;
    const { role: { roles: { list: roleList } } } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const roleOptions = [];
    roleList.map((role) => {
      roleOptions.push(<Select.Option key={role.roleId}>{role.roleName}</Select.Option>);
    });

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
      <PageHeaderLayout title="创建用户" content="创建用户，请输入用户信息：">
        <Card>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="用户名"
            >
              {getFieldDecorator('name', {
                initialValue: user.name,
                rules: [{
                  required: true, message: '请输入用户名',
                }],
              })(
                <Input placeholder="用户名" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator('password', {
                initialValue: '',
                rules: [{
                  required: true, message: '请输入密码',
                }],
              })(
                <Input placeholder="密码" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户角色"
            >
              {getFieldDecorator('role.roleId', {
                initialValue: user.role.roleId,
                rules: [{
                  required: true, message: '请选择用户角色',
                }],
              })(
                <Select placeholder="请选择角色">
                  {roleOptions}
                </Select>
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
