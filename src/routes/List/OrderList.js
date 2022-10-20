import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import OrderTable from '../../components/OrderTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './OrderList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  order: state.order,
}))
@Form.create()
export default class OrderList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    params: {
      order: {},
      pagination: {
        current: 1,
        pageSize: 10,
      },
      sorter: {},
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch({
      type: 'order/getOrders',
      payload: {
        params: JSON.stringify(params),
      }
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, params } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const newParams = {
      ...params,
      pagination: pagination,
    };
    if (filters.length === 0){
      newParams.order = {
        ...formValues,
      }
    } else {
      newParams.order = {
        ...formValues,
        ...filters,
      }
    }
    if (sorter.field) {
      newParams.sorter = {
        field: sorter.field,
        order: sorter.order,
      };
    }
    this.setState({
      params: newParams,
    });

    dispatch({
      type: 'order/getOrders',
      payload: {
        params: JSON.stringify(newParams),
      }
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const newParams = {
      order: {},
      pagination: {
        current: 1,
        pageSize: 10,
      },
      sorter: {},
    }
    this.setState({
      formValues: {},
      params: newParams,
    });
    dispatch({
      type: 'order/getOrders',
      payload: {
        params: JSON.stringify(newParams),
      },
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    switch (e.key) {
      case 'batchValidate':
        this.handleBatchValidate();
        break;
      case 'batchInvalidate':
        this.handleBatchInvalidate();
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { params } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      const newParams = {
        ...params,
        order: values,
      };
      this.setState({
        formValues: values,
        params: newParams,
      });

      dispatch({
        type: 'order/getOrders',
        payload: {
          params: JSON.stringify(newParams),
        },
      });
    });
  }

  handleNew(){
    const { dispatch } = this.props;
    dispatch({
      type: 'order/getOrder',
    });
  }

  handleValidate = (key) => {
    const { params } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'order/putOrder',
      payload: {
        order: {key, effective: 1},
        params: JSON.stringify(params),
      },
    });
  }

  handleInvalidate = (key) => {
    const { params } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'order/putOrder',
      payload: {
        order: {orderId: key, effective: 0},
        params: JSON.stringify(params),
      },
    });
  }

  handleDelete = (key) => {
    const { params } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'order/putOrder',
      payload: {
        order: {orderId: key, deleted: 1},
        params: JSON.stringify(params),
      },
    });
  }

  handleEdit = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/getOrder',
      payload: {orderId: key},
    });
  }

  handleBatchDelete = () => {
    const { selectedRows, params } = this.state;
    if (!selectedRows) return;

    const { dispatch } = this.props;
    const deletedOrders = [];
    selectedRows.map(row => {
      deletedOrders.push({...row, ...{deleted: 1}});
    });
    dispatch({
      type: 'order/putOrders',
      payload: {
        orders: deletedOrders,
        params: JSON.stringify(params),
      },
    });
  }

  handleBatchValidate = () => {
    const { selectedRows, params } = this.state;
    if (!selectedRows) return;

    const { dispatch } = this.props;
    const valiateOrders = [];
    selectedRows.map(row => {
      valiateOrders.push({...row, ...{effective: 1}});
    });
    dispatch({
      type: 'order/putOrders',
      payload: {
        orders: valiateOrders,
        params: JSON.stringify(params),
      },
    });
  }

  handleBatchInvalidate = () => {
    const { selectedRows, params } = this.state;
    if (!selectedRows) return;

    const { dispatch } = this.props;
    const invaliateOrders = [];
    selectedRows.map(row => {
      invaliateOrders.push({...row, ...{effective: 0}});
    });
    dispatch({
      type: 'order/putOrders',
      payload: {
        orders: invaliateOrders,
        params: JSON.stringify(params),
      },
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入订单号" />
              )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('effective')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">有效</Option>
                  <Option value="0">无效</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入订单号" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">有效</Option>
                  <Option value="0">无效</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="修改时间">
              {getFieldDecorator('lastModifiedAt')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入修改时间" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { order: { listLoading: loading, orders: data } } = this.props;
    const { selectedRows, modalVisible, addInputValue } = this.state;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          查看、管理订单
        </p>
        <div className={styles.contentLink}>
          <a>
            <Icon type="link" />
            快速开始
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        {/* <img alt="这是一个标题" src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" /> */}
      </div>
    );

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="batchValidate">批量启用</Menu.Item>
        <Menu.Item key="batchInvalidate">批量停用</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout
        title="订单查询"
        content={content}
        extraContent={extraContent}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleNew()}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button onClick={() => this.handleBatchDelete()}>批量取消</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <OrderTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
              validate={this.handleValidate}
              inValidate={this.handleInvalidate}
              edit={this.handleEdit}
              delete={this.handleDelete}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
