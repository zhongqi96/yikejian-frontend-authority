import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, InputNumber, Select, Spin, Popover, Checkbox } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import OrderTableForm from './OrderTableForm';
import styles from './style.less';
import moment from 'moment';
import { stringify } from 'qs';
import { getToken as getLocalToken } from '../../utils/token';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const timeFormat = 'HH:mm';

const fieldLabels = {
  customer: '客户',
  store: '店铺',
  payment: '支付',
};

@connect(state => ({
  order: state.order,
}))
@Form.create()
export default class OrderForm extends PureComponent {
  state = {
    width: '100%',
    data: [],
    value: {},
    fetching: false,
  };
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/getStores',
    });
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  }
  fetchCustomer = (value) => {
    console.log('fetching customer', value);
    const localToken = getLocalToken();
    const requestJson =  JSON.stringify({
      customer: {
        mobileNumber: value,
      },
    });
    const payload = {
      access_token: localToken,
      params: requestJson,
    }
    this.setState({ data: [], fetching: true });
    fetch(`/customer-service/v1/customers?${stringify(payload)}`)
      .then(response => response.json())
      .then((body) => {
        const data = body.list.map(customer => ({
          text: `${customer.mobileNumber} ${customer.customerName}`,
          value: customer.mobileNumber,
        }));
        this.setState({ data, fetching: false });
      });
  }
  handleCustomerChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }
  handleStoreChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/getStoreProducts',
      payload: {storeId: value},
    });
  }
  render() {
    const { form, dispatch } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { order: { order, submitting, storeProducts, itemLoading, stores } } = this.props;
    const { fetching, data, value } = this.state;

    const storeOptions = [];
    stores.map((store) => {
      storeOptions.push(<Select.Option key={store.storeId}>{store.storeName}</Select.Option>);
    });

    const productOptions = [];
    storeProducts.map((product) => {
      productOptions.push(<Select.Option key={product.productId}>{product.productName}</Select.Option>);
    });

    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          if(order.orderId){
            dispatch({
              type: 'order/editOrder',
              payload: {
                ...values,
                orderId: order.orderId,
              },
            });
          } else {
            dispatch({
              type: 'order/postOrder',
              payload: {
                ...values,
                effective: 1,
                deleted: 0,
              },
            });
          }
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <PageHeaderLayout
        title="编辑订单"
        content="填写订单信息："
        wrapperClassName={styles.advancedForm}
      >
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels['customer']}>
                  {getFieldDecorator('mobileNumber', {
                    initialValue: order.mobileNumber || '',
                    rules: [{ required: true, message: '请选择客户' }],
                  })(
                    <Select
                      showSearch={true}
                      placeholder="请选择客户"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSearch={this.fetchCustomer}
                      onChange={this.handleCustomerChange}
                      style={{ width: '100%' }}
                    >
                      {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels['store']}>
                  {getFieldDecorator('storeId', {
                    initialValue: order.storeId.toString() || '',
                    rules: [{ required: true, message: '请选择店铺' }],
                  })(
                    <Select
                      placeholder="请选择店铺"
                      onChange={this.handleStoreChange}
                      style={{ width: '100%' }}
                    >
                      {storeOptions}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="添加服务项目" className={styles.card} bordered={false} loading={itemLoading}>
          {getFieldDecorator('orderItems', {
            initialValue: order.orderItems || [],
            rules: [{ required: true, message: '请添加服务项目' }],
          })(<OrderTableForm selectOptions={productOptions}/>)}
        </Card>
        <Card title="支付信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label={fieldLabels['payment']}>
                  {getFieldDecorator('actualAmount', {
                    initialValue: order.actualAmount || '',
                    rules: [{ required: true, message: '请输入该订单支付金额' }],
                  })(
                    <InputNumber placeholder="请输入该订单支付金额"/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
