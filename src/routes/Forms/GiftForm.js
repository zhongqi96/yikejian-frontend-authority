import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, TimePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;

@connect(state => ({
  gift: state.gift,
}))
@Form.create()
export default class GiftForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'gift/getAuthorities',
    // });
  }

  listGift = (res) => {
    const { dispatch } = this.props;
    if(res.status === 'ok'){
      dispatch(routerRedux.push(`/info/gift/list`));
    } else {
      message.error(res.msg);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, gift: { gift } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(gift.key){
          dispatch({
            type: 'gift/editGift',
            payload: {...values, key: gift.key},
            callback: this.listGift,
          });
        } else {
          dispatch({
            type: 'gift/postGift',
            payload: values,
            callback: this.listGift,
          });
        }
      }
    });
  }

  render() {
    const { gift: { postGiftStatus: submitting, gift } } = this.props;
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
      <PageHeaderLayout title="创建礼品卡" content="创建礼品卡，并分配其拥有的权限">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="礼品卡名称"
            >
              {getFieldDecorator('name', {
                initialValue: gift.name,
                rules: [{
                  required: true, message: '请输入礼品卡名称',
                }],
              })(
                <Input placeholder="给礼品卡起个名字" />
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
