import React, { Component } from 'react';
import { Card, Form, Row, Col, InputNumber, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './StoreProfile.less';

const FormItem = Form.Item;

@connect(state => ({
  inventory: state.inventory,
}))
@Form.create()
export default class StoreProfile extends Component {
  constructor(props){
    super(props);
    const days = [];
    const timestamp = new Date().getTime();
    days.push(moment(timestamp).format('YYYYMMDD'));
    days.push(moment(timestamp + 1 * 24 * 60 * 60 * 1000).format('YYYYMMDD'));
    days.push(moment(timestamp + 2 * 24 * 60 * 60 * 1000).format('YYYYMMDD'));
    days.push(moment(timestamp + 3 * 24 * 60 * 60 * 1000).format('YYYYMMDD'));
    days.push(moment(timestamp + 4 * 24 * 60 * 60 * 1000).format('YYYYMMDD'));
    const { inventory: { store, storeProducts } } = this.props;
    this.state = {
      days: days,
      storeId: store.storeId,
      productId: '' || storeProducts[0].product.productId,
      day: moment(timestamp).format('YYYYMMDD'),
    }
  }

  componentDidMount() {
    const { dispatch, inventory: { store, storeProducts } } = this.props;
    const { storeId, productId, day } = this.state;
    dispatch({
      type: 'inventory/getInventories',
      payload: {
        storeId: storeId,
        productId: productId,
        day: day,
      }
    });
  }

  onProductTabChange(key) {
    const { dispatch } = this.props;
    const { storeId, productId, day } = this.state;
    this.setState({ productId: key });
    dispatch({
      type: 'inventory/getInventories',
      payload: {
        storeId: storeId,
        productId: key,
        day: day,
      }
    });
  }

  onDayTabChange(subKey) {
    const { dispatch } = this.props;
    const { storeId, productId, day } = this.state;
    this.setState({ day: subKey });
    dispatch({
      type: 'inventory/getInventories',
      payload: {
        storeId: storeId,
        productId: productId,
        day: subKey,
      }
    });
  }

  getFields() {
    const count = 100;
    const { getFieldDecorator } = this.props.form;
    const { inventory: { inventories } } = this.props;
    const children = [];
    inventories.map((inventory) => {
      children.push(
        <Col span={3} key={inventory.inventoryId}>
          <FormItem label={inventory.pieceTime}>
            {getFieldDecorator(`inventory-${inventory.inventoryId}`, {
              initialValue: inventory.stock,
            })(
              <InputNumber min={inventory.bookedStock} disabled={inventory.stock <= inventory.bookedStock} placeholder="最大可预约次数" />
            )}
          </FormItem>
        </Col>
      );
    });
    return children;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const inventories = [];
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      Object.keys(values).map((key) => {
        const inventoryId = key.substr(10);
        inventories.push({inventoryId: inventoryId, stock: values[key]});
      });
      console.log('trans to inventories: ', inventories);
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'inventory/putInventories',
      payload: {
        inventories: inventories,
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { inventory: { storeProducts, loading } } = this.props;
    const tabListNoTitle = [];
    storeProducts.map((storeProduct) => {
      tabListNoTitle.push({key: storeProduct.product.productId, tab: storeProduct.product.productName});
    });
    const { days } = this.state;
    const subTabListNoTitle = [];
    days.map((day) => {
      subTabListNoTitle.push({key: day, tab: day});
    });

    return (
      <PageHeaderLayout title="预约管理">
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          onTabChange={(key) => this.onProductTabChange(key)}
        >
          <Card
            style={{ width: '100%' }}
            tabList={subTabListNoTitle}
            onTabChange={(key) => this.onDayTabChange(key)}
            loading={loading}
          >
            <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
              <Row gutter={8}>{this.getFields()}</Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit">提交</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Card>
      </PageHeaderLayout>
    );
  }
}

// export default connect(state => ({
//   collapsed: state.global.collapsed,
//   submitting: state.store.submitting,
// }))(Form.create()(StoreProfile));
