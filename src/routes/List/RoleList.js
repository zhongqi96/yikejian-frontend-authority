import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import RoleTable from '../../components/RoleTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import { getToken as getLocalToken } from '../../utils/token';

import styles from './RoleList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  role: state.role,
}))
@Form.create()
export default class RoleList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    params: {
      role: {},
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
    // const localToken = getLocalToken();
    dispatch({
      type: 'role/getAuthorities',
      // payload: {
      //   access_token: localToken,
      // }
    });
    dispatch({
      type: 'role/getRoles',
      payload: {
        // access_token: localToken,
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

    // const params = {
    //   current: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...formValues,
    //   ...filters,
    // };
    const newParams = {
      ...params,
      // role: {
      //   ...formValues,
      //   ...filters,
      // },
      pagination: pagination,
    };
    if (filters.length === 0){
      newParams.role = {
        ...formValues,
      }
    } else {
      newParams.role = {
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
      type: 'role/getRoles',
      payload: {
        params: JSON.stringify(newParams),
      }
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const newParams = {
      role: {},
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
      type: 'role/getRoles',
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
        // lastModifiedAt: new Date(fieldsValue.lastModifiedAt),
      };

      const newParams = {
        ...params,
        role: values,
      };

      this.setState({
        formValues: values,
        params: newParams,
      });

      dispatch({
        type: 'role/getRoles',
        // payload: values,
        payload: {
          params: JSON.stringify(newParams),
        },
      });
    });
  }

  handleNew(){
    // this.props.dispatch(routerRedux.push(`/sys/role/form`));
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getRole',
      callback: this.showErrorMsg,
    });
  }

  handleEdit = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getRole',
      payload: {key: key},
      callback: this.showErrorMsg,
    });
  }

  handleValidate = (key) => {
    const { params } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'role/putRole',
      payload: {
        role: {roleId: key, effective: 1},
        params: JSON.stringify(params),
      },
      callback: this.showErrorMsg,
    });
  }

  handleInvalidate = (key) => {
    const { params } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'role/putRole',
      payload: {
        role: {roleId: key, effective: 0},
        params: JSON.stringify(params),
      },
      callback: this.showErrorMsg,
    });
  }

  handleDelete = (key) => {
    const { params } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'role/putRole',
      payload: {
        role: {roleId: key, deleted: 1},
        params: JSON.stringify(params),
      },
      callback: this.showErrorMsg,
    });
  }

  handleBatchDelete = () => {
    const { selectedRows, params } = this.state;
    if (!selectedRows) return;

    const { dispatch } = this.props;
    const deletedRoles = [];
    selectedRows.map(row => {
      deletedRoles.push({...row, ...{deleted: 1}});
    });
    dispatch({
      type: 'role/putRoles',
      payload: {
        roles: deletedRoles,
        params: JSON.stringify(params),
      },
      callback: this.showErrorMsg,
    });
  }

  handleBatchValidate = () => {
    const { selectedRows, params } = this.state;
    if (!selectedRows) return;

    const { dispatch } = this.props;
    const valiateRoles = [];
    selectedRows.map(row => {
      valiateRoles.push({...row, ...{effective: 1}});
    });
    dispatch({
      type: 'role/putRoles',
      payload: {
        roles: valiateRoles,
        params: JSON.stringify(params),
      },
      callback: this.showErrorMsg,
    });
  }

  handleBatchInvalidate = () => {
    const { selectedRows, params } = this.state;
    if (!selectedRows) return;

    const { dispatch } = this.props;
    const invaliateRoles = [];
    selectedRows.map(row => {
      invaliateRoles.push({...row, ...{effective: 0}});
    });
    dispatch({
      type: 'role/putRoles',
      payload: {
        roles: invaliateRoles,
        params: JSON.stringify(params),
      },
      callback: this.showErrorMsg,
    });
  }

  showErrorMsg = (msg) => {
    message.error(msg);
  }

  renderSimpleForm(authoritiesOptions) {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="角色名">
              {getFieldDecorator('roleName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="权限">
              {getFieldDecorator('authorities')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {authoritiesOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('effective')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">有效</Option>
                  <Option value="0">无效</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm(authoritiesOptions) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="角色名">
              {getFieldDecorator('roleName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限">
              {getFieldDecorator('authorities')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {authoritiesOptions}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('effective')(
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

  renderForm(authoritiesOptions) {
    return this.state.expandForm ? this.renderAdvancedForm(authoritiesOptions) : this.renderSimpleForm(authoritiesOptions);
  }

  render() {
    const { role: { listLoading: loading, roles: data, authorities } } = this.props;
    const { selectedRows, modalVisible, addInputValue, addInputName, addInputPassword, addInputRole, addInputDesc } = this.state;

    const authoritiesOptions = [];
    authorities.map((authority) => {
      authoritiesOptions.push(<Select.Option key={authority.code}>{authority.name}</Select.Option>);
    });

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          查看、管理角色及权限
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
        title="角色查询"
        content={content}
        extraContent={extraContent}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm(authoritiesOptions)}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleNew()}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button onClick={() => this.handleBatchDelete()}>批量删除</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <RoleTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              authoritiesOptions={authoritiesOptions}
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
