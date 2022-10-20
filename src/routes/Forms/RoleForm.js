import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, TimePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
// import { getToken as getLocalToken } from '../../utils/token';

const FormItem = Form.Item;

@connect(state => ({
  role: state.role,
}))
@Form.create()
export default class RoleForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    // const localToken = getLocalToken();
    dispatch({
      type: 'role/getAuthorities',
      // params: {
      //   access_token: localToken,
      // }
    });
  }

  showErrorMsg = (msg) => {
    message.error(msg);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, role: { role } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(role.roleId){
          dispatch({
            type: 'role/editRole',
            payload: {...values, roleId: role.roleId, authorities: values.authorities.join()},
            callback: this.showErrorMsg,
          });
        } else {
          dispatch({
            type: 'role/postRole',
            payload: {...values, authorities: values.authorities.join(), deleted: 0, effective: 1},
            callback: this.showErrorMsg,
          });
        }
      }
    });
  }

  render() {
    const { role: { postRoleStatus: submitting, authorities, role } } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const authrotiesOptions = [];
    authorities.map((authority) => {
      authrotiesOptions.push(<Select.Option key={authority.code}>{authority.name}</Select.Option>);
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
      <PageHeaderLayout title="创建角色" content="创建角色，并分配其拥有的权限">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="角色名称"
            >
              {getFieldDecorator('roleName', {
                initialValue: role.roleName,
                rules: [{
                  required: true, message: '请输入角色名称',
                }],
              })(
                <Input placeholder="给角色起个名字" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色权限"
            >
              {getFieldDecorator('authorities', {
                initialValue: typeof role.authorities === 'string' ? role.authorities.split(',') : role.authorities,
                rules: [{
                  required: true, message: '请选择至少一项权限',
                }],
              })(
                <Select mode='multiple' placeholder="请选择权限">
                  {authrotiesOptions}
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
